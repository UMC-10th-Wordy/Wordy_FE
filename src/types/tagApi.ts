export interface TagKpiDto {
  name: string
  target: string
}

export interface TagDto {
  tagId: string
  tagName: string
  color: string
  projectName: string
  projectPurpose: string
  expectedOutcome: string
  expectedStartDate: string
  expectedEndDate: string
  kpis: TagKpiDto[]
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  userId: string
}

export interface ApiEnvelope<T> {
  success: boolean
  code: string
  message: string
  result: T
}

export interface CreateTagPayload {
  tagName: string
  color: string
  projectName: string
  projectPurpose: string
  expectedOutcome: string
  expectedStartDate: string
  expectedEndDate: string
  kpis: TagKpiDto[]
}

export type TagListResponse = ApiEnvelope<TagDto[]>
export type TagDetailResponse = ApiEnvelope<TagDto>
export type CreateTagResponse = ApiEnvelope<TagDto>
