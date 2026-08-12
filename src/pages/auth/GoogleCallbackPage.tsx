import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useGoogleCallback } from '@/hooks/useAuthQueries'
import { getHome, homeQueryKeys } from '@/api/home/home'
import { fetchDefaultWorkspaceId } from '@/api/workspace/workspace'
import { clearAuthTokens, markAuthenticated, storeAuthTokens } from '@/lib/httpClient'

export const GoogleCallbackPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const code = new URLSearchParams(location.search).get('code')

  const { data, isSuccess, isError } = useGoogleCallback(code)

  useEffect(() => {
    if (!code) {
      navigate('/login', { replace: true })
      return
    }
    if (isError) {
      navigate('/login', { replace: true })
    }
  }, [code, isError, navigate])

  useEffect(() => {
    if (!isSuccess || !data) return

    if (data.status === 'login') {
      // 토큰만 먼저 저장하고, 인증 상태 플래그는 홈 데이터 캐싱 후에 바꿔
      // GuestRoute가 그 즉시 반응해서 홈으로 리다이렉트되며 Suspense가 깜빡이는 것을 막음
      storeAuthTokens(data.accessToken, data.refreshToken)
      // 홈 데이터와 홈 페이지 청크를 함께 미리 받아둬서 이동 직후 로딩 표시가 뜨지 않게 함
      fetchDefaultWorkspaceId(queryClient)
        .then((workspaceId) => {
          return Promise.all([
            ...(workspaceId
              ? [
                  queryClient.prefetchQuery({
                    queryKey: homeQueryKeys.all(workspaceId),
                    queryFn: () => getHome(workspaceId),
                  }),
                ]
              : []),
            import('@/pages/HomePage'),
          ])
        })
        .then(() => {
          markAuthenticated()
          navigate('/', { replace: true })
        })
        .catch(() => {
          clearAuthTokens()
          navigate('/login', { replace: true })
        })
    } else {
      navigate('/social-signup', {
        replace: true,
        state: { pendingToken: data.pendingToken, email: data.email },
      })
    }
  }, [isSuccess, data, navigate, queryClient])

  return null
}
