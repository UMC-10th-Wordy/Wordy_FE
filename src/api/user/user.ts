import { request } from '@/lib/httpClient'
import type {
  ProfileGetResult,
  ProfileImageUploadResult,
  ProfileRegisterRequest,
  ProfileRegisterResult,
  ProfileUpdateRequest,
  ProfileUpdateResult,
} from '@/types/user'

export const userQueryKeys = {
  all: ['user'] as const,
  profile: () => [...userQueryKeys.all, 'profile'] as const,
}

export const postProfileImage = async (file: File): Promise<ProfileImageUploadResult> => {
  const formData = new FormData()
  formData.append('image', file)

  return request<ProfileImageUploadResult>('/users/profile/image', {
    method: 'POST',
    body: formData,
  })
}

export const postProfile = async (body: ProfileRegisterRequest): Promise<ProfileRegisterResult> => {
  return request<ProfileRegisterResult>('/users/profile', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export const updateProfile = async (body: ProfileUpdateRequest): Promise<ProfileUpdateResult> => {
  return request<ProfileUpdateResult>('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export const getProfile = async (): Promise<ProfileGetResult> => {
  return request<ProfileGetResult>('/users/profile', {
    method: 'GET',
  })
}
