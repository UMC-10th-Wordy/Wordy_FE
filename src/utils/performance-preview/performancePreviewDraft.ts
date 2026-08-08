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

  try {
    const storedDraft = sessionStorage.getItem(key)

    if (!storedDraft) {
      return null
    }

    return JSON.parse(storedDraft) as PerformancePreviewDraft
  } catch {
    try {
      sessionStorage.removeItem(key)
    } catch {
      return null
    }

    return null
  }
}

export const setPerformancePreviewDraft = (
  reflectionSnapshotId: string,
  draft: PerformancePreviewDraft,
) => {
  try {
    sessionStorage.setItem(
      getPerformancePreviewDraftKey(reflectionSnapshotId),
      JSON.stringify(draft),
    )
  } catch {
    return
  }
}

export const clearPerformancePreviewDraft = (reflectionSnapshotId: string) => {
  try {
    sessionStorage.removeItem(getPerformancePreviewDraftKey(reflectionSnapshotId))
  } catch {
    return
  }
}
