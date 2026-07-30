import { useMutation, useQuery } from '@tanstack/react-query'

import {
  authQueryKeys,
  deleteWithdraw,
  getVerifyEmail,
  postLogin,
  postLogout,
  postPassword,
  postSignup,
} from '@/api/auth/auth'

export const useSignup = () => {
  return useMutation({
    mutationFn: postSignup,
  })
}

export const useLogin = () => {
  return useMutation({
    mutationFn: postLogin,
  })
}

export const useLogout = () => {
  return useMutation({
    mutationFn: postLogout,
  })
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: postPassword,
  })
}

export const useWithdraw = () => {
  return useMutation({
    mutationFn: deleteWithdraw,
  })
}

export const useVerifyEmail = (token: string | null) => {
  return useQuery({
    queryKey: authQueryKeys.verifyEmail(token ?? ''),
    queryFn: () => getVerifyEmail(token!),
    enabled: !!token,
    retry: false,
  })
}
