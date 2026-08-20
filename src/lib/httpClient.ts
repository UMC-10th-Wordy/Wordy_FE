import { useAuthStore } from '@/store/authStore'
import type { RefreshRequest, RefreshResult } from '@/types/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

interface ApiErrorBody {
  success: false
  code: string
  message: string
}

export class ApiError extends Error {
  code: string
  status: number

  constructor(status: number, body: ApiErrorBody) {
    super(body.message)
    this.code = body.code
    this.status = status
  }
}

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

// 토큰만 저장하고 인증 상태 플래그는 아직 바꾸지 않음 (GuestRoute 등 isAuthenticated 구독자의 즉시 리다이렉트를 미루고 싶을 때 사용)
export const storeAuthTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

export const markAuthenticated = () => {
  useAuthStore.getState().setAuthenticated(true)
}

export const setAuthTokens = (accessToken: string, refreshToken: string) => {
  storeAuthTokens(accessToken, refreshToken)
  markAuthenticated()
}

export const clearAuthTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  useAuthStore.getState().setAuthenticated(false)
}

const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY)
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY)

const REQUEST_TIMEOUT_MS = 10000
const REFRESH_PATH = '/auth/refresh'

// 동시에 여러 요청이 401을 받아도 재발급은 한 번만 호출되도록 공유
let refreshPromise: Promise<boolean> | null = null

const refreshAccessToken = (): Promise<boolean> => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = getRefreshToken()
      if (!refreshToken) return false

      try {
        const body: RefreshRequest = { refreshToken }
        const response = await fetch(`${API_BASE_URL}${REFRESH_PATH}`, {
          method: 'POST',
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!response.ok) return false

        const data: { result?: RefreshResult } = await response.json()
        if (!data.result) return false

        setAuthTokens(data.result.accessToken, data.result.refreshToken)
        return true
      } catch {
        return false
      }
    })().finally(() => {
      refreshPromise = null
    })
  }

  return refreshPromise
}

export const withWorkspace = (workspaceId: string, path: string): string =>
  `/workspaces/${encodeURIComponent(workspaceId)}${path}`

export const request = async <T>(
  path: string,
  options: RequestInit = {},
  isRetry = false,
): Promise<T> => {
  const accessToken = getAccessToken()
  const isFormData = options.body instanceof FormData

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    signal: options.signal ?? AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
  })

  const text = await response.text()
  let data: { result?: T } & Partial<ApiErrorBody> = {}
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = {}
    }
  }

  if (!response.ok) {
    if (response.status === 401 && accessToken && !isRetry && path !== REFRESH_PATH) {
      // 다른 요청이 이미 재발급을 마쳤다면 재발급 없이 최신 토큰으로 바로 재시도
      if (getAccessToken() !== accessToken) {
        return request<T>(path, options, true)
      }

      const refreshed = await refreshAccessToken()
      if (refreshed) {
        return request<T>(path, options, true)
      }
      clearAuthTokens()
    }

    throw new ApiError(response.status, {
      success: false,
      code: data.code ?? 'UNKNOWN_ERROR',
      message: data.message ?? '알 수 없는 오류가 발생했어요.',
    })
  }

  return data.result as T
}
