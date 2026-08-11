import type { ApiEnvelope } from '@/types/api'

export interface Workspace {
  workspaceId: string
  name: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

/* 워크스페이스 생성 */
// POST /workspaces

export interface CreateWorkspaceRequest {
  name: string
}

export type CreateWorkspaceResult = Workspace

export type CreateWorkspaceResponse = ApiEnvelope<CreateWorkspaceResult>

/* 워크스페이스 목록 조회 */
// GET /workspaces

export type WorkspaceListResult = Workspace[]

export type WorkspaceListResponse = ApiEnvelope<WorkspaceListResult>

/* 워크스페이스 이름 수정 */
// PATCH /workspaces/{workspaceId}

export interface UpdateWorkspaceRequest {
  name: string
}

export type UpdateWorkspaceResult = Workspace

export type UpdateWorkspaceResponse = ApiEnvelope<UpdateWorkspaceResult>

/* 워크스페이스 삭제 */
// DELETE /workspaces/{workspaceId}

export type DeleteWorkspaceResult = null

export type DeleteWorkspaceResponse = ApiEnvelope<DeleteWorkspaceResult>
