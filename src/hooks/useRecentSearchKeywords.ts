import { useState } from 'react'

const RECENT_SEARCH_STORAGE_KEY = 'wordy-recent-diary-search-keywords'
const MAX_RECENT_SEARCH_KEYWORDS = 5

const getStoredKeywords = (): string[] => {
  try {
    const storedKeywords = localStorage.getItem(RECENT_SEARCH_STORAGE_KEY)

    if (!storedKeywords) {
      return []
    }

    const parsedKeywords: unknown = JSON.parse(storedKeywords)

    if (!Array.isArray(parsedKeywords)) {
      return []
    }

    return parsedKeywords.filter((keyword): keyword is string => typeof keyword === 'string')
  } catch {
    return []
  }
}

const saveStoredKeywords = (keywords: string[]) => {
  try {
    localStorage.setItem(RECENT_SEARCH_STORAGE_KEY, JSON.stringify(keywords))
  } catch {
    // localStorage 사용이 제한된 환경에서는 현재 세션의 상태만 유지
  }
}

export const useRecentSearchKeywords = () => {
  const [recentKeywords, setRecentKeywords] = useState<string[]>(getStoredKeywords)

  const addRecentKeyword = (keyword: string) => {
    const trimmedKeyword = keyword.trim()

    if (!trimmedKeyword) {
      return
    }

    setRecentKeywords((previousKeywords) => {
      const nextKeywords = [
        trimmedKeyword,
        ...previousKeywords.filter((recentKeyword) => recentKeyword !== trimmedKeyword),
      ].slice(0, MAX_RECENT_SEARCH_KEYWORDS)

      saveStoredKeywords(nextKeywords)

      return nextKeywords
    })
  }

  const removeRecentKeyword = (keyword: string) => {
    setRecentKeywords((previousKeywords) => {
      const nextKeywords = previousKeywords.filter((recentKeyword) => recentKeyword !== keyword)

      saveStoredKeywords(nextKeywords)

      return nextKeywords
    })
  }

  const clearRecentKeywords = () => {
    setRecentKeywords([])
    saveStoredKeywords([])
  }

  return {
    recentKeywords,
    addRecentKeyword,
    removeRecentKeyword,
    clearRecentKeywords,
  }
}
