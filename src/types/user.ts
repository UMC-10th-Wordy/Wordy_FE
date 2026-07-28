export interface UserApiResponse<T> {
  success: boolean
  code: string
  message: string
  result: T
}

/* 프로필 이미지 업로드 */
// POST /users/profile/image

export interface ProfileImageUploadResult {
  profileImgUrl: string
}

export type ProfileImageUploadResponse = UserApiResponse<ProfileImageUploadResult>

/* 프로필 등록 */
// POST /users/profile

export type YearsOfService = 'UNDER_1' | 'ONE_TO_3' | 'THREE_TO_5' | 'FIVE_TO_10' | 'OVER_10'

export type JobRole =
  | 'PRODUCT_PLANNING'
  | 'DEVELOPMENT'
  | 'DESIGN'
  | 'MARKETING_SALES'
  | 'DATA_ANALYSIS'
  | 'CUSTOMER_SUPPORT'
  | 'HR'
  | 'FINANCE_ACCOUNTING'
  | 'EDUCATION_RESEARCH'
  | 'FREELANCER'
  | 'STUDENT'
  | 'ETC'

export interface ProfileRegisterRequest {
  userName: string
  profileImgUrl?: string
  yearsOfService: YearsOfService
  jobRole: JobRole
}

export interface ProfileRegisterResult {
  userId: string
  email: string
}

export type ProfileRegisterResponse = UserApiResponse<ProfileRegisterResult>

/* 프로필 수정 */
// PUT /users/profile

export interface ProfileUpdateRequest {
  userName?: string
  profileImgUrl?: string
  yearsOfService?: YearsOfService
  jobRole?: JobRole
}

export interface ProfileUpdateResult {
  userId: string
  email: string
}

export type ProfileUpdateResponse = UserApiResponse<ProfileUpdateResult>

/* 내 프로필 조회 */
// GET /users/profile

export interface ProfileGetResult {
  userId: string
  email: string
  userName: string
  profileImgUrl: string
  yearsOfService: YearsOfService
  jobRole: JobRole
  createdAt: string
}

export type ProfileGetResponse = UserApiResponse<ProfileGetResult>
