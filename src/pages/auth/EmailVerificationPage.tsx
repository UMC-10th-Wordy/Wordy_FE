import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { TextButton } from '@/components/common/Button/TextButton'
import { VerificationCard } from '@/components/auth/VerificationCard'
import { ToastContainer } from '@/components/common/Toast/ToastContainer'
import EmailRequestIcon from '@/assets/icons/email-request.svg?react'
import EmailSuccessIcon from '@/assets/icons/email-success.svg?react'
import EmailFailIcon from '@/assets/icons/email-fail.svg?react'
import { useVerifyEmail } from '@/hooks/useAuthQueries'
import { useToast } from '@/hooks/useToast'
import { setAuthTokens } from '@/lib/httpClient'

type VerificationStatus = 'request' | 'loading' | 'success' | 'fail'

export const EmailVerificationPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const token = params.get('token')

  const { isPending, isSuccess, isError, data, error } = useVerifyEmail(token)
  const { toasts, addToast } = useToast()

  useEffect(() => {
    if (isSuccess && data) {
      setAuthTokens(data.accessToken, data.refreshToken)
      // 메일 속 링크는 새 탭으로 열리는 경우가 많아, 원래 탭(대기 화면)에도
      // 인증 완료를 알려서 자동으로 다음 화면으로 넘어가게 함. 대기 탭이 자신이
      // 기다리던 이메일인지 확인할 수 있도록 email도 함께 보냄(다른 계정의 인증
      // 완료를 이 탭이 그대로 받아 로그인해버리는 것을 방지)
      const channel = new BroadcastChannel('email-verification')
      channel.postMessage({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        email: data.email,
      })
      channel.close()
    }
    if (isError) {
      console.error('이메일 인증 실패:', error)
    }
  }, [isSuccess, isError, data, error])

  const pendingEmail = location.state?.email
  useEffect(() => {
    if (token || !pendingEmail) return
    const channel = new BroadcastChannel('email-verification')
    channel.onmessage = (
      event: MessageEvent<{ accessToken: string; refreshToken: string; email: string }>,
    ) => {
      if (event.data.email !== pendingEmail) return
      setAuthTokens(event.data.accessToken, event.data.refreshToken)
      navigate('/profile-setup')
    }
    return () => channel.close()
  }, [token, pendingEmail, navigate])

  const status: VerificationStatus = !token
    ? 'request'
    : isSuccess
      ? 'success'
      : isError
        ? 'fail'
        : isPending
          ? 'loading'
          : 'request'

  // TODO(#45): API 연동 시 서버 세션 기반으로 교체
  const email: string = location.state?.email ?? 'sample.email@naver.com'
  const handleResend = () => {
    // TODO(#35): 백엔드에 인증 메일 재전송 API 추가되면 연동
    addToast('아직 지원하지 않는 기능이에요')
  }

  const illustrationByStatus = {
    request: <EmailRequestIcon width={180} height={195} />,
    loading: <EmailRequestIcon width={180} height={195} />,
    success: <EmailSuccessIcon width={180} height={201} />,
    fail: <EmailFailIcon width={180} height={201} />,
  }
  const illustration = illustrationByStatus[status]

  if (status === 'loading') {
    return (
      <VerificationCard
        illustration={illustration}
        title="인증을 확인하고 있어요"
        description="잠시만 기다려 주세요"
        action={
          <TextButton variant="fill" size="large" fullWidth disabled>
            확인 중...
          </TextButton>
        }
      />
    )
  }

  if (status === 'success') {
    return (
      <VerificationCard
        illustration={illustration}
        title="인증을 완료했어요"
        description="지금 바로 프로필을 등록하고 워디를 시작해 볼까요?"
        action={
          <TextButton
            variant="fill"
            size="large"
            fullWidth
            onClick={() => navigate('/profile-setup')}
          >
            프로필 등록하기
          </TextButton>
        }
      />
    )
  }

  if (status === 'fail') {
    return (
      <>
        <VerificationCard
          illustration={illustration}
          title="인증에 실패했어요"
          description="인증을 다시 시도해 주세요"
          action={
            <TextButton variant="fill" size="large" fullWidth onClick={handleResend}>
              인증 메일 재전송하기
            </TextButton>
          }
          footer={
            <div className="flex items-center justify-center gap-2 [font-size:var(--font-size-body-3)] text-(--color-text-tertiary)">
              <span>제대로 인증되지 않나요?</span>
              {/* TODO(#35): 문의하기 연결 */}
              <TextButton variant="text_only" size="small">
                문의하기
              </TextButton>
            </div>
          }
        />
        <ToastContainer toasts={toasts} />
      </>
    )
  }

  return (
    <>
      <VerificationCard
        illustration={illustration}
        title="이메일을 확인해 주세요"
        description={
          <>
            <span className="font-medium text-(--color-text-default)">{email}</span>으로 인증 메일을
            보냈어요
            <br />
            메일이 보이지 않는다면 스팸함을 확인하거나
            <br />
            인증 메일 재전송을 요청해 주세요
          </>
        }
        action={
          <TextButton variant="fill" size="large" fullWidth onClick={handleResend}>
            인증 메일 재전송하기
          </TextButton>
        }
        footer={
          <div className="flex items-center justify-center gap-2 [font-size:var(--font-size-body-3)] text-(--color-text-tertiary)">
            <span>이메일이 잘못되었나요?</span>
            {/* TODO(#35): 회원가입 페이지로 돌아가기 라우팅 연결 */}
            <TextButton variant="text_only" size="small" onClick={() => navigate('/signup')}>
              이메일 주소 바꾸기
            </TextButton>
          </div>
        }
      />
      <ToastContainer toasts={toasts} />
    </>
  )
}
