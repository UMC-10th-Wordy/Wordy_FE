import { request } from '@/lib/httpClient'
import type { HomeResult } from '@/types/home'

export const homeQueryKeys = {
  all: (workspaceId: string) => ['home', workspaceId] as const,
}

export const getHome = async (workspaceId: string): Promise<HomeResult> => {
  return request<HomeResult>(`/workspaces/${encodeURIComponent(workspaceId)}/home`, {
    method: 'GET',
  })
}
