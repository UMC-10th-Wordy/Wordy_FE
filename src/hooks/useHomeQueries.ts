import { useSuspenseQuery } from '@tanstack/react-query'

import { getHome, homeQueryKeys } from '@/api/home/home'
import { useActiveWorkspaceId } from '@/hooks/useWorkspaceQueries'

export const useGetHome = () => {
  const workspaceId = useActiveWorkspaceId()

  return useSuspenseQuery({
    queryKey: homeQueryKeys.all(workspaceId),
    queryFn: () => getHome(workspaceId),
    refetchOnMount: 'always',
  })
}
