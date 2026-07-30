import { getRefreshToken, request } from '@/lib/httpClient'
import type {
  ChangePasswordRequest,
  ChangePasswordResult,
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
}

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
