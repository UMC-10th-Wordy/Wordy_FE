import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { highlightSearchKeyword } from './highlightSearchKeyword'

describe('highlightSearchKeyword', () => {
  it('검색어와 일치하는 부분을 강조한다', () => {
    render(<div>{highlightSearchKeyword('오늘 회고 작성', '회고')}</div>)

    expect(screen.getByText('회고')).toHaveClass('text-(--color-text-brand)')
  })

  it('검색어 앞뒤 공백을 제거하고 매칭한다', () => {
    render(<div>{highlightSearchKeyword('오늘 회고 작성', ' 회고 ')}</div>)

    expect(screen.getByText('회고')).toBeInTheDocument()
  })

  it('검색어가 비어있으면 원본 텍스트를 그대로 반환한다', () => {
    render(<div>{highlightSearchKeyword('오늘 회고 작성', '   ')}</div>)

    expect(screen.getByText('오늘 회고 작성')).toBeInTheDocument()
  })

  it('정규식 특수문자가 포함된 검색어도 리터럴로 매칭한다', () => {
    render(<div>{highlightSearchKeyword('React (공부)', '(공부)')}</div>)

    expect(screen.getByText('(공부)')).toBeInTheDocument()
  })

  it('대소문자를 구분하지 않고 매칭한다', () => {
    render(<div>{highlightSearchKeyword('React Query 학습', 'query')}</div>)

    expect(screen.getByText('Query')).toHaveClass('text-(--color-text-brand)')
  })
})
