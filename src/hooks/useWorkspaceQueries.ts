import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createWorkspace,
  deleteWorkspace,
  getDefaultWorkspaceId,
  getWorkspaces,
  updateWorkspace,
  workspaceQueryKeys,
} from '@/api/workspace/workspace'
import { useWorkspaceStore } from '@/store/workspaceStore'

export const useGetWorkspaces = () => {
  return useQuery({
    queryKey: workspaceQueryKeys.lists(),
    queryFn: getWorkspaces,
  })
}

export const useActiveWorkspaceId = () => {
  const { data: workspacesData } = useGetWorkspaces()
  const { selectedWorkspaceId } = useWorkspaceStore()
  const workspaces = workspacesData ?? []
  const defaultWorkspaceId = getDefaultWorkspaceId(workspaces)
  const isSelectedInList = workspaces.some((w) => w.workspaceId === selectedWorkspaceId)

  return isSelectedInList ? (selectedWorkspaceId as string) : defaultWorkspaceId
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
