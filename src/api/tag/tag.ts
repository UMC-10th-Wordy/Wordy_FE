import type { CreateTagPayload, TagDto } from '@/types/tag'
import { ApiError, request } from '@/lib/httpClient'

function withWorkspace(workspaceId: string, path: string): string {
  return `/workspaces/${encodeURIComponent(workspaceId)}${path}`
}

export async function getTags(workspaceId: string): Promise<TagDto[]> {
  return request<TagDto[]>(withWorkspace(workspaceId, '/tags'))
}

export async function getTagDetail(workspaceId: string, tagId: string): Promise<TagDto | null> {
  try {
    return await request<TagDto>(withWorkspace(workspaceId, `/tags/${encodeURIComponent(tagId)}`))
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
}

export async function createTag(workspaceId: string, payload: CreateTagPayload): Promise<TagDto> {
  return request<TagDto>(withWorkspace(workspaceId, '/tags'), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateTag(
  workspaceId: string,
  tagId: string,
  payload: CreateTagPayload,
): Promise<TagDto> {
  return request<TagDto>(withWorkspace(workspaceId, `/tags/${encodeURIComponent(tagId)}`), {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function deleteTag(workspaceId: string, tagId: string): Promise<void> {
  await request<null>(withWorkspace(workspaceId, `/tags/${encodeURIComponent(tagId)}`), {
    method: 'DELETE',
  })
}
