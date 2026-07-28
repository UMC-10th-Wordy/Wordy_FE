import { useQuery } from '@tanstack/react-query'

import { getProfile, userQueryKeys } from '@/api/user/user'

export const useGetProfile = () => {
  return useQuery({
    queryKey: userQueryKeys.profile(),
    queryFn: getProfile,
  })
}
