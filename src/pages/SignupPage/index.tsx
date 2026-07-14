import { useState } from 'react'
import { Input1 } from '@/components/common/Input/Input1'
import { TextButton } from '@/components/common/Button/TextButton'
import { TermsSection, isRequiredTermsChecked } from '@/components/auth/TermsSection'
import type { TermsState } from '@/components/auth/TermsSection'
import LogoIcon from '@/assets/icons/logo.svg?react'
import { useNavigate } from 'react-router-dom'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// 영문, 숫자, 특수문자 모두 포함 8자 이상 (피그마 힌트 문구 기준)
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/

export const SignupPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [terms, setTerms] = useState<TermsState>({
    age: false,
    service: false,
    privacy: false,
    marketing: false,
  })
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    passwordConfirm: false,
  })

  const emailError = !email
    ? '이메일을 입력해주세요.'
    : !EMAIL_REGEX.test(email)
      ? '올바른 이메일 형식이 아니에요.'
      : ''
  const passwordError = !password
    ? '비밀번호를 입력해주세요.'
    : !PASSWORD_REGEX.test(password)
      ? '영문, 숫자, 특수문자를 모두 포함한 8자리 이상으로 만들어주세요.'
      : ''
  const passwordConfirmError = !passwordConfirm
    ? '비밀번호를 한 번 더 입력해주세요.'
    : passwordConfirm !== password
      ? '비밀번호가 일치하지 않아요.'
      : ''

  const requiredTermsChecked = isRequiredTermsChecked(terms)
  const isValid = !emailError && !passwordError && !passwordConfirmError && requiredTermsChecked

  const handleSubmit = () => {
    if (!isValid) return
    // TODO(#18): API 연동 시 회원가입 요청 성공 응답 후 이동으로 교체
    navigate('/email-verification', { state: { email } })
  }

  return (
    <div className="flex min-h-screen justify-center bg-(--color-bg-secondary) px-6 py-16">
      <div className="flex h-fit w-full max-w-[800px] flex-col gap-[52px] rounded-[32px] bg-(--color-bg-default) px-[100px] py-[80px] shadow-xl shadow-black/5">
        <header>
          <LogoIcon className="mb-6 h-7 w-auto" />
          <h1 className="mb-2 text-3xl font-bold text-(--color-text-default)">회원가입</h1>
          <p className="text-(--color-text-tertiary)">환영합니다! 워디를 시작해볼까요?</p>
        </header>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
          className="flex flex-col gap-[52px]"
        >
          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-(--color-text-default)">기본 정보</h2>

            <Input1
              type="email"
              label={
                <span>
                  이메일 <span className="text-(--color-text-error)">*</span>
                </span>
              }
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              placeholder="이메일을 입력해 주세요"
              error={touched.email && emailError ? emailError : undefined}
            />

            <Input1
              type="password"
              label={
                <span>
                  비밀번호 <span className="text-(--color-text-error)">*</span>
                </span>
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              placeholder="비밀번호를 입력해 주세요"
              hint="영문, 숫자, 특수문자를 모두 포함한 8자리 이상의 조합으로 만들어주세요"
              error={touched.password && passwordError ? passwordError : undefined}
            />

            <Input1
              type="password"
              label={
                <span>
                  비밀번호 확인 <span className="text-(--color-text-error)">*</span>
                </span>
              }
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, passwordConfirm: true }))}
              placeholder="비밀번호를 한 번 더 입력해 주세요"
              error={
                touched.passwordConfirm && passwordConfirmError ? passwordConfirmError : undefined
              }
            />
          </section>

          <TermsSection terms={terms} onChange={setTerms} />

          <TextButton type="submit" variant="fill" size="large" fullWidth disabled={!isValid}>
            계정 생성하기
          </TextButton>
        </form>

        <div className="flex items-center justify-center gap-1 text-sm text-(--color-text-tertiary)">
          <span>이미 회원이신가요?</span>
          {/* TODO(#이슈번호): 로그인 페이지 라우팅 연결 */}
          <TextButton variant="text_only" size="small">
            로그인
          </TextButton>
        </div>
      </div>
    </div>
  )
}
