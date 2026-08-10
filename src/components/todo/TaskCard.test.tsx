import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import TaskCard from './TaskCard'
import type { Task } from '@/types/todo'

vi.mock('@/api/tag/tag', () => ({
  getTags: vi.fn().mockResolvedValue([]),
}))

const completedTaskWithoutResult: Task = {
  id: 'task-1',
  date: '2026-08-11',
  title: '주간성과보고',
  priority: 'should',
  isCompleted: true,
  tag: { label: '디자인 시스템', color: 'green' },
}

const completedTaskWithResult: Task = {
  ...completedTaskWithoutResult,
  result: '기존 업무 결과',
}

const incompleteTask: Task = {
  id: 'task-2',
  date: '2026-08-11',
  title: '온보딩 리뉴얼',
  priority: 'must',
  isCompleted: false,
}

describe('TaskCard 수정 모드', () => {
  it('업무 결과를 건드리지 않고 제목만 수정하면 결과 저장은 호출되지 않는다', () => {
    const onEdit = vi.fn()
    const onSaveResult = vi.fn()

    render(
      <TaskCard
        task={completedTaskWithoutResult}
        isExpanded={false}
        onToggleExpanded={() => {}}
        onEdit={onEdit}
        onSaveResult={onSaveResult}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: '수정' }))
    const titleInput = screen.getByDisplayValue('주간성과보고')
    fireEvent.change(titleInput, { target: { value: '주간성과보고 수정' } })
    fireEvent.click(screen.getByRole('button', { name: '수정하기' }))

    expect(onEdit).toHaveBeenCalledTimes(1)
    expect(onSaveResult).not.toHaveBeenCalled()
  })

  it('업무 결과 내용을 실제로 수정하면 결과 저장이 함께 호출된다', () => {
    const onEdit = vi.fn()
    const onSaveResult = vi.fn()

    render(
      <TaskCard
        task={completedTaskWithoutResult}
        isExpanded={false}
        onToggleExpanded={() => {}}
        onEdit={onEdit}
        onSaveResult={onSaveResult}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: '수정' }))
    const resultInput = screen.getAllByRole('textbox')[2]
    fireEvent.change(resultInput, { target: { value: '새로 작성한 업무 결과' } })
    fireEvent.click(screen.getByRole('button', { name: '수정하기' }))

    expect(onSaveResult).toHaveBeenCalledWith(
      expect.objectContaining({ result: '새로 작성한 업무 결과' }),
    )
  })

  it('기존 업무 결과를 지우면 수정하기 버튼이 비활성화되어 저장 자체가 되지 않는다', () => {
    const onEdit = vi.fn()
    const onSaveResult = vi.fn()

    render(
      <TaskCard
        task={completedTaskWithResult}
        isExpanded={false}
        onToggleExpanded={() => {}}
        onEdit={onEdit}
        onSaveResult={onSaveResult}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: '수정' }))
    const resultInput = screen.getByDisplayValue('기존 업무 결과')
    fireEvent.change(resultInput, { target: { value: '' } })
    const confirmButton = screen.getByRole('button', { name: '수정하기' })
    expect(confirmButton).toBeDisabled()

    fireEvent.click(confirmButton)

    expect(onEdit).not.toHaveBeenCalled()
    expect(onSaveResult).not.toHaveBeenCalled()
  })

  it('미완료 업무는 결과 필드가 없으므로 제목만 수정해도 결과 저장이 호출되지 않는다', () => {
    const onEdit = vi.fn()
    const onSaveResult = vi.fn()

    render(
      <TaskCard
        task={incompleteTask}
        isExpanded={false}
        onToggleExpanded={() => {}}
        onEdit={onEdit}
        onSaveResult={onSaveResult}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: '수정' }))
    const titleInput = screen.getByDisplayValue('온보딩 리뉴얼')
    fireEvent.change(titleInput, { target: { value: '온보딩 리뉴얼 v2' } })
    fireEvent.click(screen.getByRole('button', { name: '수정하기' }))

    expect(onEdit).toHaveBeenCalledTimes(1)
    expect(onSaveResult).not.toHaveBeenCalled()
  })
})
