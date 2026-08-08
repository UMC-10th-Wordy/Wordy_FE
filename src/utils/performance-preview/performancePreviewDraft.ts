export interface PerformancePreviewDraft {
  summary: string
  insight: string
}

const getPerformancePreviewDraftKey = (reflectionSnapshotId: string) =>
  `performance-preview-draft:${reflectionSnapshotId}`

export const getPerformancePreviewDraft = (
  reflectionSnapshotId: string,
): PerformancePreviewDraft | null => {
  const key = getPerformancePreviewDraftKey(reflectionSnapshotId)
  const storedDraft = sessionStorage.getItem(key)

  if (!storedDraft) {
    return null
  }

  try {
    return JSON.parse(storedDraft) as PerformancePreviewDraft
  } catch {
    sessionStorage.removeItem(key)
    return null
  }
}

export const setPerformancePreviewDraft = (
  reflectionSnapshotId: string,
  draft: PerformancePreviewDraft,
) => {
  sessionStorage.setItem(getPerformancePreviewDraftKey(reflectionSnapshotId), JSON.stringify(draft))
}

export const clearPerformancePreviewDraft = (reflectionSnapshotId: string) => {
  sessionStorage.removeItem(getPerformancePreviewDraftKey(reflectionSnapshotId))
}
