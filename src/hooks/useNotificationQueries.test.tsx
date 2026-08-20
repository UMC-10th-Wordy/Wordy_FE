import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import { useReadNotification } from './useNotificationQueries'
import { notificationQueryKeys, readNotification } from '@/api/notification/notification'
import type { NotificationListResult } from '@/types/notification'

vi.mock('@/api/notification/notification', async () => {
  const actual = await vi.importActual<typeof import('@/api/notification/notification')>(
    '@/api/notification/notification',
  )
  return {
    ...actual,
    readNotification: vi.fn(),
  }
})

vi.mock('@/hooks/useWorkspaceQueries', () => ({
  useActiveWorkspaceId: () => 'workspace-1',
}))

const seedData: NotificationListResult = {
  items: [
    {
      notificationId: 'n1',
      type: 'A',
      title: 't1',
      content: 'c1',
      redirectUrl: '/a',
      isRead: false,
      createdAt: '2026-01-01',
    },
    {
      notificationId: 'n2',
      type: 'B',
      title: 't2',
      content: 'c2',
      redirectUrl: '/b',
      isRead: false,
      createdAt: '2026-01-02',
    },
  ],
  page: 1,
  size: 50,
  totalCount: 2,
  totalPages: 1,
  hasNext: false,
}

const setup = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  queryClient.setQueryData(notificationQueryKeys.lists('workspace-1'), seedData)

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  return { queryClient, wrapper }
}

describe('useReadNotification', () => {
  beforeEach(() => {
    vi.mocked(readNotification).mockReset()
  })

  it('성공 시 목록에서 항목을 제거하고 totalCount를 낮춘다', async () => {
    vi.mocked(readNotification).mockResolvedValue({
      notificationId: 'n1',
      isRead: true,
      redirectUrl: '/a',
    })
    const { queryClient, wrapper } = setup()

    const { result } = renderHook(() => useReadNotification(), { wrapper })
    result.current.mutate('n1')

    await waitFor(() => {
      const data = queryClient.getQueryData<NotificationListResult>(
        notificationQueryKeys.lists('workspace-1'),
      )
      expect(data?.items.map((item) => item.notificationId)).toEqual(['n2'])
      expect(data?.totalCount).toBe(1)
    })

    expect(readNotification).toHaveBeenCalledWith('workspace-1', 'n1')
  })

  it('실패 시 원래 목록으로 롤백한다', async () => {
    vi.mocked(readNotification).mockRejectedValue(new Error('network error'))
    const { queryClient, wrapper } = setup()

    const { result } = renderHook(() => useReadNotification(), { wrapper })
    result.current.mutate('n1')

    await waitFor(() => expect(result.current.isError).toBe(true))

    const data = queryClient.getQueryData<NotificationListResult>(
      notificationQueryKeys.lists('workspace-1'),
    )
    expect(data).toEqual(seedData)
  })
})
