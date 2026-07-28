import { useState } from 'react'
import { Input1 } from '@/components/common/Input/Input1'
import { Checkbox } from '@/components/common/Checkbox/Checkbox'
import { TextButton } from '@/components/common/Button/TextButton'
import LogoIcon from '@/assets/icons/logo.svg?react'
import GoogleIcon from '@/assets/icons/google.svg?react'
import { useNavigate } from 'react-router-dom'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [touched, setTouched] = useState({ email: false, password: false })

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
    if (!isValid) return
    // TODO: API 연동 시 자체 로그인 요청으로 교체
    // TODO: 서버 응답 실패 시 "이메일 또는 비밀번호가 일치하지 않아요." 에러 표시
    alert(`로그인 시도: ${email}`)
  }

  const handleGoogleLogin = () => {
    // TODO: API 연동 시 백엔드 구글 로그인 엔드포인트로 이동
    alert('구글 로그인은 API 연동 단계에서 구현 예정')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-(--color-bg-secondary) px-6 py-8">
      <div className="flex w-full max-w-[800px] flex-col gap-8 rounded-[32px] bg-(--color-bg-default) px-[100px] py-10 shadow-xl shadow-black/5 [@media(min-height:960px)]:gap-[52px] [@media(min-height:960px)]:py-[80px]">
        <div className="flex flex-col">
          <LogoIcon className="mb-4 h-8 w-auto self-start" />
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
          className="flex flex-col gap-4"
        >
          <Input1
            type="email"
            aria-label="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            placeholder="이메일을 입력해주세요"
            error={touched.email && emailError ? emailError : undefined}
          />
          <Input1
            type="password"
            aria-label="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            placeholder="비밀번호를 입력해주세요"
            error={touched.password && passwordError ? passwordError : undefined}
          />
          <div className="mb-4 flex items-center justify-between">
            <Checkbox
              label="로그인 정보 기억하기"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            {/* TODO: 비밀번호 찾기 페이지 연결 */}
            <button
              type="button"
              className="[font-size:var(--font-size-body-4)] font-medium leading-(--line-height-body) text-(--color-button-default)"
            >
              비밀번호 찾기
            </button>
          </div>
          <TextButton type="submit" variant="fill" size="large" fullWidth disabled={!isValid}>
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
            iconLeft={<GoogleIcon width={20} height={20} />}
            onClick={handleGoogleLogin}
            className="gap-2.5 border-[#747775] hover:border-[#747775] active:border-[#747775]"
          >
            Google로 시작하기
          </TextButton>
        </div>

        <div className="flex items-center justify-center gap-3">
          <span className="[font-size:var(--font-size-body-3)] font-normal leading-(--line-height-body) text-(--color-text-tertiary)">
            아직 회원이 아니신가요?
          </span>
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="[font-size:var(--font-size-body-4)] font-medium leading-(--line-height-body) text-(--color-text-brand)"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  )
}
