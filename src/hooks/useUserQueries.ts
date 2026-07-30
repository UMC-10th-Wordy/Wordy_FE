import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

import { getProfile, userQueryKeys } from '@/api/user/user'
import type { ProfileGetResult } from '@/types/user'

export const useGetProfile = (options?: Partial<UseQueryOptions<ProfileGetResult>>) => {
  return useQuery({
    queryKey: userQueryKeys.profile(),
    queryFn: getProfile,
    ...options,
  })
}
