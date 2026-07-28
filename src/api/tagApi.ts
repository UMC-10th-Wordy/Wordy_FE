import type { CreateTagPayload, TagDto } from '@/types/tagApi'

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
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(TEMP_ACCESS_TOKEN ? { Authorization: `Bearer ${TEMP_ACCESS_TOKEN}` } : {}),
      ...options?.headers,
    },
  })

  const data = await response.json()

  if (!response.ok || !data.success) {
    throw new ApiError(data.message || `요청에 실패했습니다. (${response.status})`, response.status)
  }

  return data.result as T
}

export async function getTags(): Promise<TagDto[]> {
  return request<TagDto[]>('/tags')
}

export async function getTagDetail(tagId: string): Promise<TagDto | null> {
  try {
    return await request<TagDto>(`/tags/${encodeURIComponent(tagId)}`)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
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
