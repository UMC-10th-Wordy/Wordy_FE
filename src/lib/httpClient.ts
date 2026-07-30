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

// TODO(#Auth): Auth API 연동 후 실제 토큰 발급/저장 로직으로 채워짐
const TEMP_ACCESS_TOKEN = import.meta.env.DEV ? import.meta.env.VITE_TEMP_ACCESS_TOKEN : undefined

const getAccessToken = () => {
  return localStorage.getItem('accessToken') ?? TEMP_ACCESS_TOKEN ?? null
}

const REQUEST_TIMEOUT_MS = 10000

export const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
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
    throw new ApiError(response.status, {
      success: false,
      code: data.code ?? 'UNKNOWN_ERROR',
      message: data.message ?? '알 수 없는 오류가 발생했어요.',
    })
  }

  return data.result as T
}
