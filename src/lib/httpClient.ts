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
const getAccessToken = () => localStorage.getItem('accessToken')

export const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const accessToken = getAccessToken()
  const isFormData = options.body instanceof FormData

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new ApiError(response.status, data)
  }

  return data.result
}
