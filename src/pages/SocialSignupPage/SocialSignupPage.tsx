import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextButton } from '@/components/common/Button/TextButton'
import { TermsSection, isRequiredTermsChecked } from '@/components/auth/TermsSection'
import type { TermsState } from '@/components/auth/TermsSection'
import LogoIcon from '@/assets/icons/logo.svg?react'

export const SocialSignupPage = () => {
  const navigate = useNavigate()
  const [terms, setTerms] = useState<TermsState>({
    age: false,
    service: false,
    privacy: false,
    marketing: false,
  })

  const isValid = isRequiredTermsChecked(terms)

  const handleSubmit = () => {
    if (!isValid) return
    // TODO: API 연동 시 소셜 가입 완료 요청으로 교체
    navigate('/profile-setup')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-(--color-bg-secondary) px-6 py-8">
      <div className="flex w-full max-w-[800px] flex-col gap-8 rounded-[32px] bg-(--color-bg-default) px-[100px] py-10 shadow-xl shadow-black/5 [@media(min-height:960px)]:gap-[52px] [@media(min-height:960px)]:py-[80px]">
        <div className="flex flex-col">
          <LogoIcon className="mb-4 h-8 w-auto self-start" />
          <h1 className="[font-size:var(--font-size-heading-1)] font-semibold leading-(--line-height-heading) text-(--color-text-default)">
            회원가입
          </h1>
          <p className="[font-size:var(--font-size-body-1)] font-normal leading-(--line-height-body) text-(--color-text-tertiary)">
            환영합니다! 워디를 시작해볼까요?
          </p>
        </div>

        <TermsSection terms={terms} onChange={setTerms} />

        <TextButton
          variant="fill"
          size="large"
          fullWidth
          disabled={!isValid}
          onClick={handleSubmit}
        >
          계정 생성하기
        </TextButton>

        <div className="flex items-center justify-center gap-3">
          <span className="[font-size:var(--font-size-body-3)] font-normal leading-(--line-height-body) text-(--color-text-tertiary)">
            이미 회원이신가요?
          </span>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="[font-size:var(--font-size-body-4)] font-medium leading-(--line-height-body) text-(--color-button-default)"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  )
}
