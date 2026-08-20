import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getNotifications, readNotification } from './notification'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const jsonResponse = (status: number, body: unknown) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(body),
  }) as unknown as Response

describe('getNotifications', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(200, { result: null })))
  })

  it('workspaceId를 경로에 포함해 요청한다', async () => {
    await getNotifications('workspace-1')

    const [url] = vi.mocked(fetch).mock.calls[0]
    expect(url).toBe(`${API_BASE_URL}/workspaces/workspace-1/notifications`)
  })

  it('status/page/size를 쿼리 파라미터로 전달한다', async () => {
    await getNotifications('workspace-1', { status: 'unread', page: 2, size: 50 })

    const [url] = vi.mocked(fetch).mock.calls[0]
    expect(url).toBe(
      `${API_BASE_URL}/workspaces/workspace-1/notifications?status=unread&page=2&size=50`,
    )
  })
})

describe('readNotification', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(200, { result: null })))
  })

  it('workspaceId와 notificationId를 경로에 포함해 PATCH 요청한다', async () => {
    await readNotification('workspace-1', 'notif-1')

    const [url, options] = vi.mocked(fetch).mock.calls[0]
    expect(url).toBe(`${API_BASE_URL}/workspaces/workspace-1/notifications/notif-1/read`)
    expect(options?.method).toBe('PATCH')
  })
})
