import { useQuery } from '@tanstack/react-query'
import { getTags, tagQueryKeys } from '@/api/tag/tag'
import { useActiveWorkspaceId } from '@/hooks/useWorkspaceQueries'
import { mapTagDtoToTaskTag } from '@/utils/tagMapper'

export const useGetTags = (enabled: boolean) => {
  const workspaceId = useActiveWorkspaceId()

  return useQuery({
    queryKey: tagQueryKeys.all(workspaceId),
    queryFn: async () => {
      const dtos = await getTags(workspaceId)
      return dtos.map(mapTagDtoToTaskTag)
    },
    enabled: !!workspaceId && enabled,
  })
}
