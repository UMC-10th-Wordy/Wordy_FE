import { useState } from 'react'
import { TextButton } from '@/components/common/Button/TextButton'
import { VerificationCard } from '@/components/auth/VerificationCard'
import EmailRequestIcon from '@/assets/icons/email-request.svg?react'
import EmailSuccessIcon from '@/assets/icons/email-success.svg?react'
import EmailFailIcon from '@/assets/icons/email-fail.svg?react'
import { useLocation, useNavigate } from 'react-router-dom'

// TODO(#35): 라우팅 도입 시 URL 파라미터/서버 검증 결과로 상태 결정하도록 교체
type VerificationStatus = 'request' | 'success' | 'fail'

export const EmailVerificationPage = () => {
  const navigate = useNavigate()
  const [status] = useState<VerificationStatus>('success')
  // TODO(#35): 회원가입 페이지에서 입력한 이메일 전달받도록 교체
  const location = useLocation()
  // 회원가입에서 전달받은 이메일. 직접 URL 접근 시 대비 기본값
  // TODO(#35): API 연동 시 서버 세션/토큰 기반으로 교체
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
          <div className="flex items-center gap-1 text-sm text-(--color-text-tertiary)">
            <span>제대로 인증되지 않나요?</span>
            {/* TODO(#35): 문의하기 연결 */}
            <TextButton variant="text_only" size="small">
              문의하기
            </TextButton>
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
        <div className="flex items-center gap-1 text-sm text-(--color-text-tertiary)">
          <span>이메일이 잘못되었나요?</span>
          {/* TODO(#35): 회원가입 페이지로 돌아가기 라우팅 연결 */}
          <TextButton variant="text_only" size="small" onClick={() => navigate('/signup')}>
            이메일 주소 바꾸기
          </TextButton>
        </div>
      }
    />
  )
}
