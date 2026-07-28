import { useQuery } from '@tanstack/react-query'

import { getProfile } from './user.api'

export const userQueryKeys = {
  all: ['user'] as const,
  profile: () => [...userQueryKeys.all, 'profile'] as const,
}

export const useGetProfile = () => {
  return useQuery({
    queryKey: userQueryKeys.profile(),
    queryFn: getProfile,
  })
}
