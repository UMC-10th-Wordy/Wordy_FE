import type { QueryClient } from '@tanstack/react-query'
import { request } from '@/lib/httpClient'

import type {
  CreateWorkspaceRequest,
  CreateWorkspaceResult,
  DeleteWorkspaceResult,
  UpdateWorkspaceRequest,
  UpdateWorkspaceResult,
  WorkspaceListResult,
} from '@/types/workspace'

export const createWorkspace = async (
  body: CreateWorkspaceRequest,
): Promise<CreateWorkspaceResult> => {
  return request<CreateWorkspaceResult>('/workspaces', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export const getWorkspaces = async (): Promise<WorkspaceListResult> => {
  return request<WorkspaceListResult>('/workspaces', {
    method: 'GET',
  })
}

export const updateWorkspace = async (
  workspaceId: string,
  body: UpdateWorkspaceRequest,
): Promise<UpdateWorkspaceResult> => {
  return request<UpdateWorkspaceResult>(`/workspaces/${encodeURIComponent(workspaceId)}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export const deleteWorkspace = async (workspaceId: string): Promise<DeleteWorkspaceResult> => {
  return request<DeleteWorkspaceResult>(`/workspaces/${encodeURIComponent(workspaceId)}`, {
    method: 'DELETE',
  })
}

export const workspaceQueryKeys = {
  all: ['workspace'] as const,

  lists: () => [...workspaceQueryKeys.all, 'list'] as const,
}

export const getDefaultWorkspaceId = (workspaces: WorkspaceListResult): string =>
  workspaces.find((w) => w.isDefault)?.workspaceId ?? workspaces[0]?.workspaceId ?? ''

export const fetchDefaultWorkspaceId = async (queryClient: QueryClient): Promise<string> => {
  const workspaces = await queryClient.fetchQuery({
    queryKey: workspaceQueryKeys.lists(),
    queryFn: getWorkspaces,
  })
  return getDefaultWorkspaceId(workspaces)
}
