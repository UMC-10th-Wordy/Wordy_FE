import { INITIAL_TAG_MOCKS } from '@/mocks/tagApiMock'
import type { CreateTagPayload, TagDto } from '@/types/tagApi'

let tagMockStore: TagDto[] = [...INITIAL_TAG_MOCKS]

export async function getTags(): Promise<TagDto[]> {
  return tagMockStore
}

export async function getTagDetail(tagId: string): Promise<TagDto | null> {
  return tagMockStore.find((tag) => tag.tagId === tagId) ?? null
}

export async function createTag(payload: CreateTagPayload): Promise<TagDto> {
  const now = new Date().toISOString()
  const created: TagDto = {
    tagId: crypto.randomUUID(),
    tagName: payload.tagName,
    color: payload.color,
    projectName: payload.projectName,
    projectPurpose: payload.projectPurpose,
    expectedOutcome: payload.expectedOutcome,
    expectedStartDate: payload.expectedStartDate
      ? `${payload.expectedStartDate}T00:00:00.000Z`
      : '',
    expectedEndDate: payload.expectedEndDate ? `${payload.expectedEndDate}T00:00:00.000Z` : '',
    kpis: payload.kpis,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    userId: 'mock-user',
  }
  tagMockStore = [...tagMockStore, created]
  return created
}

export async function updateTag(tagId: string, payload: CreateTagPayload): Promise<TagDto> {
  const now = new Date().toISOString()
  const existing = tagMockStore.find((tag) => tag.tagId === tagId)
  if (!existing) throw new Error('TAG_NOT_FOUND')
  const updated: TagDto = {
    ...existing,
    tagName: payload.tagName,
    color: payload.color,
    projectName: payload.projectName,
    projectPurpose: payload.projectPurpose,
    expectedOutcome: payload.expectedOutcome,
    expectedStartDate: payload.expectedStartDate
      ? `${payload.expectedStartDate}T00:00:00.000Z`
      : '',
    expectedEndDate: payload.expectedEndDate ? `${payload.expectedEndDate}T00:00:00.000Z` : '',
    kpis: payload.kpis,
    updatedAt: now,
  }
  tagMockStore = tagMockStore.map((tag) => (tag.tagId === tagId ? updated : tag))
  return updated
}

export async function deleteTag(tagId: string): Promise<void> {
  const exists = tagMockStore.some((tag) => tag.tagId === tagId)
  if (!exists) throw new Error('TAG_NOT_FOUND')
  tagMockStore = tagMockStore.filter((tag) => tag.tagId !== tagId)
}
