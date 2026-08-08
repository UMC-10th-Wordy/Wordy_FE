import { getRefreshToken, request } from '@/lib/httpClient'
import type {
  ChangePasswordRequest,
  ChangePasswordResult,
  GoogleCallbackResult,
  GoogleCompleteRequest,
  GoogleCompleteResult,
  LoginRequest,
  LoginResult,
  LogoutRequest,
  LogoutResult,
  SignupRequest,
  SignupResult,
  VerifyEmailResult,
  WithdrawResult,
} from '@/types/auth'

export const authQueryKeys = {
  verifyEmail: (token: string) => ['auth', 'verify-email', token] as const,
  googleCallback: (code: string) => ['auth', 'google-callback', code] as const,
}

// 백엔드가 구글 인증 페이지로 302 리다이렉트하므로 fetch가 아닌 브라우저 이동으로 호출해야 함
export const GOOGLE_AUTH_URL = `${import.meta.env.VITE_API_BASE_URL}/auth/google`

export const postSignup = async (body: SignupRequest): Promise<SignupResult> => {
  return request<SignupResult>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export const getVerifyEmail = async (token: string): Promise<VerifyEmailResult> => {
  return request<VerifyEmailResult>(`/auth/verify-email?token=${encodeURIComponent(token)}`, {
    method: 'GET',
  })
}

export const postLogin = async (body: LoginRequest): Promise<LoginResult> => {
  return request<LoginResult>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export const postLogout = async (): Promise<LogoutResult> => {
  const body: LogoutRequest = { refreshToken: getRefreshToken() ?? '' }
  return request<LogoutResult>('/auth/logout', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export const postPassword = async (body: ChangePasswordRequest): Promise<ChangePasswordResult> => {
  return request<ChangePasswordResult>('/auth/password', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export const deleteWithdraw = async (): Promise<WithdrawResult> => {
  return request<WithdrawResult>('/auth/withdraw', {
    method: 'DELETE',
  })
}

export const getGoogleCallback = async (code: string): Promise<GoogleCallbackResult> => {
  return request<GoogleCallbackResult>(`/auth/google/callback?code=${encodeURIComponent(code)}`, {
    method: 'GET',
  })
}

export const postGoogleComplete = async (
  body: GoogleCompleteRequest,
): Promise<GoogleCompleteResult> => {
  return request<GoogleCompleteResult>('/auth/google/complete', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
