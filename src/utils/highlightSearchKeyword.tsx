import type { ReactNode } from 'react'

const escapeRegExp = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const highlightSearchKeyword = (text: string, keyword: string): ReactNode => {
  const trimmedKeyword = keyword.trim()

  if (!trimmedKeyword) {
    return text
  }

  const keywordPattern = new RegExp(`(${escapeRegExp(trimmedKeyword)})`, 'gi')

  return text.split(keywordPattern).map((part, index) => {
    const isMatched = part.toLocaleLowerCase() === trimmedKeyword.toLocaleLowerCase()

    if (!isMatched) {
      return part
    }

    return (
      <span key={`${part}-${index}`} className="text-(--color-text-brand)">
        {part}
      </span>
    )
  })
}
