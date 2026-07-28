import { useLocation, useNavigate } from 'react-router-dom'
import { TextButton } from '@/components/common/Button/TextButton'
import { VerificationCard } from '@/components/auth/VerificationCard'
import EmailRequestIcon from '@/assets/icons/email-request.svg?react'
import EmailSuccessIcon from '@/assets/icons/email-success.svg?react'
import EmailFailIcon from '@/assets/icons/email-fail.svg?react'

// TODO(#45): API 연동 시 서버 검증 결과 리다이렉트 기반으로 교체
type VerificationStatus = 'request' | 'success' | 'fail'

export const EmailVerificationPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const statusParam = params.get('status')
  const status: VerificationStatus =
    statusParam === 'success' || statusParam === 'fail' ? statusParam : 'request'

  // TODO(#45): API 연동 시 서버 세션 기반으로 교체
  const email: string = location.state?.email ?? 'sample.email@naver.com'
  const handleResend = () => {
    // TODO(#35): API 연동 시 인증 메일 재전송 요청으로 교체
    alert('인증 메일 재전송')
  }

  const illustrationByStatus = {
    request: <EmailRequestIcon width={180} height={180} />,
    success: <EmailSuccessIcon width={180} height={180} />,
    fail: <EmailFailIcon width={180} height={180} />,
  }
  const illustration = illustrationByStatus[status]

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
          <div className="flex items-center justify-center gap-3 [font-size:var(--font-size-body-3)] text-(--color-text-tertiary)">
            <span>제대로 인증되지 않나요?</span>
            {/* TODO(#35): 문의하기 연결 */}
            <button
              type="button"
              className="[font-size:var(--font-size-body-4)] font-medium leading-(--line-height-body) text-(--color-button-default)"
            >
              문의하기
            </button>
          </div>
        }
      />
    )
  }

  return (
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
        <div className="flex items-center justify-center gap-3 [font-size:var(--font-size-body-3)] text-(--color-text-tertiary)">
          <span>이메일이 잘못되었나요?</span>
          {/* TODO(#35): 회원가입 페이지로 돌아가기 라우팅 연결 */}
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="[font-size:var(--font-size-body-4)] font-medium leading-(--line-height-body) text-(--color-button-default)"
          >
            이메일 주소 바꾸기
          </button>
        </div>
      }
    />
  )
}
