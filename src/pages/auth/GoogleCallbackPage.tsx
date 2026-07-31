import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useGoogleCallback } from '@/hooks/useAuthQueries'
import { getHome, homeQueryKeys } from '@/api/home/home'
import { setAuthTokens } from '@/lib/httpClient'

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
      setAuthTokens(data.accessToken, data.refreshToken)
      // 홈 데이터를 미리 캐싱해 이동 직후 Suspense 로딩 화면이 깜빡이지 않도록 함
      queryClient
        .prefetchQuery({ queryKey: homeQueryKeys.all, queryFn: getHome })
        .finally(() => navigate('/', { replace: true }))
    } else {
      navigate('/social-signup', {
        replace: true,
        state: { pendingToken: data.pendingToken, email: data.email },
      })
    }
  }, [isSuccess, data, navigate, queryClient])

  return null
}
