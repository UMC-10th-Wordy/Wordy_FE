import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createWorkspace,
  deleteWorkspace,
  getWorkspaces,
  updateWorkspace,
  workspaceQueryKeys,
} from '@/api/workspace/workspace'

export const useGetWorkspaces = () => {
  return useQuery({
    queryKey: workspaceQueryKeys.lists(),
    queryFn: getWorkspaces,
  })
}

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createWorkspace,

    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: workspaceQueryKeys.lists() })
    },
  })
}

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ workspaceId, name }: { workspaceId: string; name: string }) =>
      updateWorkspace(workspaceId, { name }),

    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: workspaceQueryKeys.lists() })
    },
  })
}

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteWorkspace,

    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: workspaceQueryKeys.lists() })
    },
  })
}
