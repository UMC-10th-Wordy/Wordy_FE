import type { ApiEnvelope } from '@/types/api'

/* 회원가입 */
// POST /auth/signup

export type AgreementType = 'TERMS_OF_SERVICE' | 'PRIVACY_POLICY' | 'AGE_OVER_14' | 'MARKETING'

export interface SignupAgreement {
  type: AgreementType
  isAgreed: boolean
}

export interface SignupRequest {
  email: string
  password: string
  agreements: SignupAgreement[]
}

export interface SignupResult {
  email: string
}

export type SignupResponse = ApiEnvelope<SignupResult>

/* 이메일 인증 */
// GET /auth/verify-email

export type Plan = 'FREE' | 'PRO'

export interface VerifyEmailResult {
  accessToken: string
  refreshToken: string
  email: string
  userName: string | null
  plan: Plan
  profileImgUrl: string | null
}

export type VerifyEmailResponse = ApiEnvelope<VerifyEmailResult>

/* 로그인 */
// POST /auth/login

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResult {
  accessToken: string
  refreshToken: string
  email: string
  userName: string
  plan: Plan
  profileImgUrl: string
}

export type LoginResponse = ApiEnvelope<LoginResult>

/* 로그아웃 */
// POST /auth/logout

export interface LogoutRequest {
  refreshToken: string
}

export type LogoutResult = null

export type LogoutResponse = ApiEnvelope<LogoutResult>

/* 비밀번호 변경 */
// POST /auth/password

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export type ChangePasswordResult = null

export type ChangePasswordResponse = ApiEnvelope<ChangePasswordResult>

/* 회원 탈퇴 */
// DELETE /auth/withdraw

export type WithdrawResult = null

export type WithdrawResponse = ApiEnvelope<WithdrawResult>

/* 액세스 토큰 재발급 */
// POST /auth/refresh

export interface RefreshRequest {
  refreshToken: string
}

export interface RefreshResult {
  accessToken: string
  refreshToken: string
}

export type RefreshResponse = ApiEnvelope<RefreshResult>
