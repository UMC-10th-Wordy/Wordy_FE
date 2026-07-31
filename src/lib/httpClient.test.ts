import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, clearAuthTokens, getRefreshToken, request, setAuthTokens } from './httpClient'
import { useAuthStore } from '@/store/authStore'

const jsonResponse = (status: number, body: unknown) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(body),
    json: async () => body,
  }) as unknown as Response

const emptyResponse = (status: number) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    text: async () => '',
  }) as unknown as Response

describe('httpClient', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  it('액세스 토큰이 있으면 Authorization 헤더를 붙인다', async () => {
    setAuthTokens('access-1', 'refresh-1')
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(200, { data: 'ok' }))

    await request('/tasks')

    const [, options] = vi.mocked(fetch).mock.calls[0]
    expect((options?.headers as Record<string, string>).Authorization).toBe('Bearer access-1')
  })

  it('FormData 요청에는 Content-Type을 직접 설정하지 않는다', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(200, { data: 'ok' }))

    await request('/tasks/1/attachment', { method: 'POST', body: new FormData() })

    const [, options] = vi.mocked(fetch).mock.calls[0]
    expect((options?.headers as Record<string, string>)['Content-Type']).toBeUndefined()
  })

  it('일반 요청에는 Content-Type을 application/json으로 설정한다', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(200, { data: 'ok' }))

    await request('/tasks')

    const [, options] = vi.mocked(fetch).mock.calls[0]
    expect((options?.headers as Record<string, string>)['Content-Type']).toBe('application/json')
  })

  it('401 응답을 받으면 토큰을 재발급받고 원래 요청을 재시도한다', async () => {
    setAuthTokens('expired-access', 'refresh-1')
    vi.mocked(fetch)
      .mockResolvedValueOnce(
        jsonResponse(401, { success: false, code: 'EXPIRED', message: '만료' }),
      )
      .mockResolvedValueOnce(
        jsonResponse(200, { result: { accessToken: 'new-access', refreshToken: 'new-refresh' } }),
      )
      .mockResolvedValueOnce(jsonResponse(200, { result: { data: 'ok' } }))

    const result = await request('/tasks')

    expect(result).toEqual({ data: 'ok' })
    expect(fetch).toHaveBeenCalledTimes(3)
    const [, retryOptions] = vi.mocked(fetch).mock.calls[2]
    expect((retryOptions?.headers as Record<string, string>).Authorization).toBe(
      'Bearer new-access',
    )
    expect(getRefreshToken()).toBe('new-refresh')
  })

  it('동시에 여러 요청이 401이어도 재발급 요청은 한 번만 호출된다', async () => {
    setAuthTokens('expired-access', 'refresh-1')
    vi.mocked(fetch).mockImplementation(async (input) => {
      const path = String(input)
      if (path.endsWith('/auth/refresh')) {
        return jsonResponse(200, {
          result: { accessToken: 'new-access', refreshToken: 'new-refresh' },
        })
      }
      const call = vi
        .mocked(fetch)
        .mock.calls.filter(([url]) => !String(url).endsWith('/auth/refresh'))
      const isRetry = call.length > 2
      return isRetry
        ? jsonResponse(200, { data: 'ok' })
        : jsonResponse(401, { success: false, code: 'EXPIRED', message: '만료' })
    })

    await Promise.all([request('/tasks'), request('/tags')])

    const refreshCalls = vi
      .mocked(fetch)
      .mock.calls.filter(([url]) => String(url).endsWith('/auth/refresh'))
    expect(refreshCalls).toHaveLength(1)
  })

  it('재발급 실패 시 토큰과 인증 상태를 초기화한다', async () => {
    setAuthTokens('expired-access', 'refresh-1')
    vi.mocked(fetch)
      .mockResolvedValueOnce(
        jsonResponse(401, { success: false, code: 'EXPIRED', message: '만료' }),
      )
      .mockResolvedValueOnce(
        jsonResponse(401, { success: false, code: 'INVALID', message: '재발급 실패' }),
      )

    await expect(request('/tasks')).rejects.toBeInstanceOf(ApiError)
    expect(localStorage.getItem('accessToken')).toBeNull()
    expect(getRefreshToken()).toBeNull()
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
  })

  it('오류 응답을 ApiError로 변환한다', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse(400, {
        success: false,
        code: 'INVALID_INPUT',
        message: '입력이 올바르지 않아요.',
      }),
    )

    await expect(request('/tasks')).rejects.toMatchObject({
      status: 400,
      code: 'INVALID_INPUT',
      message: '입력이 올바르지 않아요.',
    })
  })

  it('응답 본문이 비어 있어도 예외 없이 처리한다', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(emptyResponse(204))

    await expect(request('/tasks/1')).resolves.toBeUndefined()
  })
})

describe('clearAuthTokens', () => {
  it('저장된 토큰을 모두 제거한다', () => {
    setAuthTokens('a', 'b')

    clearAuthTokens()

    expect(localStorage.getItem('accessToken')).toBeNull()
    expect(getRefreshToken()).toBeNull()
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
  })
})
