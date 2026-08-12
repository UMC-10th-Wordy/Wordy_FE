import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Input1 } from '@/components/common/Input/Input1'
import { Checkbox } from '@/components/common/Checkbox/Checkbox'
import { TextButton } from '@/components/common/Button/TextButton'
import { ToastContainer } from '@/components/common/Toast/ToastContainer'
import LogoIcon from '@/assets/icons/logo.svg?react'
import GoogleIcon from '@/assets/icons/google.svg?react'
import { useNavigate } from 'react-router-dom'
import { GOOGLE_AUTH_URL } from '@/api/auth/auth'
import { getHome, homeQueryKeys } from '@/api/home/home'
import { fetchDefaultWorkspaceId } from '@/api/workspace/workspace'
import { useLogin } from '@/hooks/useAuthQueries'
import { useToast } from '@/hooks/useToast'
import { ApiError, clearAuthTokens, markAuthenticated, storeAuthTokens } from '@/lib/httpClient'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const LoginPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { toasts, addToast } = useToast()
  const { mutate: login, isPending } = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const emailError = !email
    ? '이메일을 입력해주세요.'
    : !EMAIL_REGEX.test(email)
      ? '올바른 이메일 형식이 아니에요.'
      : ''
  const passwordError = !password
    ? '비밀번호를 입력해주세요.'
    : password.length < 8
      ? '비밀번호는 8자 이상이어야 해요.'
      : ''
  const isValid = !emailError && !passwordError

  const handleSubmit = () => {
    setSubmitted(true)
    if (!isValid) return
    login(
      { email, password },
      {
        onSuccess: async (data) => {
          // 토큰만 먼저 저장(요청 인증용)하고, isAuthenticated 플래그는 홈 데이터 캐싱 후에 바꿔
          // GuestRoute가 그 즉시 반응해서 홈으로 리다이렉트되며 Suspense가 깜빡이는 것을 막음
          storeAuthTokens(data.accessToken, data.refreshToken)
          // 홈 데이터와 홈 페이지 청크를 함께 미리 받아둬서 이동 직후 로딩 표시가 뜨지 않게 함
          try {
            const workspaceId = await fetchDefaultWorkspaceId(queryClient)
            await Promise.all([
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
            markAuthenticated()
            navigate('/')
          } catch {
            clearAuthTokens()
            addToast('로그인 처리 중 오류가 발생했어요. 다시 시도해 주세요.')
          }
        },
        onError: (error) => {
          addToast(
            error instanceof ApiError ? error.message : '이메일 또는 비밀번호가 일치하지 않아요.',
          )
        },
      },
    )
  }

  const handleGoogleLogin = () => {
    // 302 리다이렉트 응답이므로 fetch가 아닌 브라우저 이동으로 처리
    window.location.href = GOOGLE_AUTH_URL
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-(--color-bg-secondary) px-6 py-8">
      <div className="flex w-full max-w-[800px] flex-col gap-8 rounded-[32px] bg-(--color-bg-default) px-[100px] py-10 shadow-xl shadow-black/5 [@media(min-height:960px)]:gap-[52px] [@media(min-height:960px)]:py-[80px]">
        <div className="flex flex-col">
          <LogoIcon className="mb-3 h-7 w-auto self-start" />
          <h1 className="[font-size:var(--font-size-heading-1)] font-semibold leading-(--line-height-heading) text-(--color-text-default)">
            로그인
          </h1>
          <p className="[font-size:var(--font-size-body-1)] font-normal leading-(--line-height-body) text-(--color-text-tertiary)">
            오늘도 워디를 만나러 오셨군요, 반가워요!
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
          className="flex flex-col gap-5"
        >
          <Input1
            type="email"
            aria-label="이메일"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력해주세요"
            error={submitted && emailError ? emailError : undefined}
          />
          <Input1
            type="password"
            aria-label="비밀번호"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해주세요"
            error={submitted && passwordError ? passwordError : undefined}
          />
          <div className="flex items-center justify-between">
            <Checkbox
              label="로그인 정보 기억하기"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            {/* TODO: 비밀번호 찾기 페이지 연결 */}
            <TextButton variant="text_only" size="small">
              비밀번호 찾기
            </TextButton>
          </div>
          <TextButton
            type="submit"
            variant="fill"
            size="large"
            fullWidth
            disabled={isPending}
            className="mt-3"
          >
            로그인 하기
          </TextButton>
        </form>

        <div className="-mt-[21px] flex flex-col gap-[31px] [@media(max-height:959px)]:-mt-px">
          <div className="flex items-center gap-[19px]">
            <div className="h-px flex-1 bg-(--color-border-subtle)" />
            <span className="[font-size:var(--font-size-body-4)] text-(--color-text-tertiary)">
              또는
            </span>
            <div className="h-px flex-1 bg-(--color-border-subtle)" />
          </div>

          <TextButton
            variant="stroke_neutral"
            size="large"
            fullWidth
            iconLeft={<GoogleIcon width={32} height={32} />}
            onClick={handleGoogleLogin}
            className="border-[#747775] hover:border-[#747775] active:border-[#747775]"
          >
            Google로 시작하기
          </TextButton>
        </div>

        <div className="flex items-center justify-center gap-2 [@media(min-height:960px)]:-mt-3">
          <span className="[font-size:var(--font-size-body-3)] font-normal leading-(--line-height-body) text-(--color-text-tertiary)">
            아직 회원이 아니신가요?
          </span>
          <TextButton variant="text_only" size="small" onClick={() => navigate('/signup')}>
            회원가입
          </TextButton>
        </div>
      </div>

      <ToastContainer toasts={toasts} />
    </div>
  )
}
