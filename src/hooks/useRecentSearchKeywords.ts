import { useState } from 'react'

const RECENT_SEARCH_STORAGE_KEY = 'wordy-recent-diary-search-keywords'
const MAX_RECENT_SEARCH_COUNT = 5

const getStoredKeywords = (): string[] => {
  const storedKeywords = localStorage.getItem(RECENT_SEARCH_STORAGE_KEY)

  if (!storedKeywords) {
    return []
  }

  try {
    const parsedKeywords: unknown = JSON.parse(storedKeywords)

    if (!Array.isArray(parsedKeywords)) {
      return []
    }

    return parsedKeywords.filter((keyword): keyword is string => typeof keyword === 'string')
  } catch {
    return []
  }
}

export interface UseRecentSearchKeywordsReturn {
  recentKeywords: string[]
  addRecentKeyword: (keyword: string) => void
  removeRecentKeyword: (keyword: string) => void
  clearRecentKeywords: () => void
}

export const useRecentSearchKeywords = (): UseRecentSearchKeywordsReturn => {
  const [recentKeywords, setRecentKeywords] = useState<string[]>(getStoredKeywords)

  const updateRecentKeywords = (keywords: string[]) => {
    setRecentKeywords(keywords)
    localStorage.setItem(RECENT_SEARCH_STORAGE_KEY, JSON.stringify(keywords))
  }

  const addRecentKeyword = (keyword: string) => {
    const trimmedKeyword = keyword.trim()

    if (!trimmedKeyword) {
      return
    }

    const nextKeywords = [
      trimmedKeyword,
      ...recentKeywords.filter((recentKeyword) => recentKeyword !== trimmedKeyword),
    ].slice(0, MAX_RECENT_SEARCH_COUNT)

    updateRecentKeywords(nextKeywords)
  }

  const removeRecentKeyword = (keyword: string) => {
    const nextKeywords = recentKeywords.filter((recentKeyword) => recentKeyword !== keyword)

    updateRecentKeywords(nextKeywords)
  }

  const clearRecentKeywords = () => {
    updateRecentKeywords([])
  }

  return {
    recentKeywords,
    addRecentKeyword,
    removeRecentKeyword,
    clearRecentKeywords,
  }
}
