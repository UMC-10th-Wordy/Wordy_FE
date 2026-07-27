import type { CreateTagPayload, TagDto } from '@/types/tagApi'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  const data = await response.json()

  if (!response.ok || !data.success) {
    throw new Error(data.message || `요청에 실패했습니다. (${response.status})`)
  }

  return data.result as T
}

export async function getTags(): Promise<TagDto[]> {
  return request<TagDto[]>('/tags')
}

export async function getTagDetail(tagId: string): Promise<TagDto | null> {
  try {
    return await request<TagDto>(`/tags/${encodeURIComponent(tagId)}`)
  } catch {
    return null
  }
}

export async function createTag(payload: CreateTagPayload): Promise<TagDto> {
  return request<TagDto>('/tags', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateTag(tagId: string, payload: CreateTagPayload): Promise<TagDto> {
  return request<TagDto>(`/tags/${encodeURIComponent(tagId)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export async function deleteTag(tagId: string): Promise<void> {
  await request<null>(`/tags/${encodeURIComponent(tagId)}`, {
    method: 'DELETE',
  })
}
