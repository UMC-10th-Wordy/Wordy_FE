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
