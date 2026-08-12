import type { CreateTagPayload, TagDto } from '@/types/tag'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
const TEMP_ACCESS_TOKEN = import.meta.env.DEV ? import.meta.env.VITE_TEMP_ACCESS_TOKEN : undefined

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const accessToken = localStorage.getItem('accessToken') ?? TEMP_ACCESS_TOKEN
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options?.headers,
    },
  })

  const data = await response.json()

  if (!response.ok || !data.success) {
    throw new ApiError(data.message || `요청에 실패했습니다. (${response.status})`, response.status)
  }

  return data.result as T
}

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
