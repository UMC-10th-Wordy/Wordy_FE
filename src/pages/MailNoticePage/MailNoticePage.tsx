import { TextButton } from '@/components/common/Button/TextButton'
import LogoIcon from '@/assets/icons/logo.svg?react'

// 메일 수신 화면 (사용자가 받는 인증 메일 본문 UI)
// TODO(#35): 실제 메일 발송 템플릿 적용 방식은 백엔드와 협의 필요
export const MailNoticePage = () => {
  const handleVerify = () => {
    // TODO(#35): API 연동 시 인증 처리 링크로 교체
    alert('메일 인증 처리')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-(--color-bg-secondary) px-6 py-16">
      <div className="flex w-full max-w-[800px] flex-col gap-[60px] rounded-[32px] bg-(--color-bg-default) px-[100px] py-[80px] shadow-xl shadow-black/5">
        <div className="flex flex-col gap-3">
          <LogoIcon className="mb-3 h-7 w-auto self-start" />
          <h1 className="text-3xl font-bold text-(--color-text-default)">메일 인증 알림</h1>
          <p className="leading-relaxed text-(--color-text-tertiary)">
            환영합니다! 워디를 시작해볼까요?
            <br />
            계정을 활성화하려면 아래 버튼을 눌러 메일을 인증해 주세요
          </p>
        </div>

        <TextButton variant="fill" size="large" fullWidth onClick={handleVerify}>
          메일 인증하기
        </TextButton>
      </div>
    </div>
  )
}
