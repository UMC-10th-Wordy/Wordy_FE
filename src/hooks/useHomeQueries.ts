import { useSuspenseQuery } from '@tanstack/react-query'

import { getHome, homeQueryKeys } from '@/api/home/home'

export const useGetHome = () => {
  return useSuspenseQuery({
    queryKey: homeQueryKeys.all,
    queryFn: getHome,
  })
}
