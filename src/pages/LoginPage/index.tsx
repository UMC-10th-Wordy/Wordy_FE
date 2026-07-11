import { useState } from 'react'
import { Input1 } from '@/components/common/Input/Input1'
import { Checkbox } from '@/components/common/Checkbox/Checkbox'
import { TextButton } from '@/components/common/Button/TextButton'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const LoginPage = () => {
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
    <div className="flex min-h-screen justify-center bg-(--color-bg-default) px-6 py-16">
      <div className="w-full max-w-lg">
        {/* TODO: 로고 svg 에셋 받으면 교체 */}
        <p className="mb-6 text-2xl font-extrabold text-(--color-button-default)">Wordy</p>

        <h1 className="mb-2 text-3xl font-bold text-(--color-text-default)">로그인</h1>
        <p className="mb-10 text-(--color-text-tertiary)">
          오늘도 워디를 만나러 오셨군요, 반가워요!
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
          className="flex flex-col gap-4"
        >
          <Input1
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            placeholder="이메일을 입력해주세요"
            error={touched.email && emailError ? emailError : undefined}
          />

          <Input1
            type="password"
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
            {/* TODO: 비밀번호 찾기 페이지 라우팅 연결 */}
            <TextButton variant="text_only" size="small">
              비밀번호 찾기
            </TextButton>
          </div>

          <TextButton type="submit" variant="fill" size="large" fullWidth disabled={!isValid}>
            로그인 하기
          </TextButton>
        </form>

        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-(--color-border-subtle)" />
          <span className="text-sm text-(--color-text-tertiary)">또는</span>
          <div className="h-px flex-1 bg-(--color-border-subtle)" />
        </div>

        {/* TODO: 구글 G 로고 svg 에셋 받으면 교체 */}
        <TextButton variant="stroke_neutral" size="large" fullWidth onClick={handleGoogleLogin}>
          Google로 시작하기
        </TextButton>

        <div className="mt-8 flex items-center justify-center gap-1 text-sm text-(--color-text-tertiary)">
          <span>아직 회원이 아니신가요?</span>
          {/* TODO: 회원가입 페이지 라우팅 연결 */}
          <TextButton variant="text_only" size="small">
            회원가입
          </TextButton>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
