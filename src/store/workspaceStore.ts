import { create } from 'zustand'

interface WorkspaceState {
  selectedWorkspaceId: string | null
  setSelectedWorkspaceId: (workspaceId: string | null) => void
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  selectedWorkspaceId: null,
  setSelectedWorkspaceId: (workspaceId) => set({ selectedWorkspaceId: workspaceId }),
}))
