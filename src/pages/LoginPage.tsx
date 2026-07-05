import { useState } from 'react'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
  const showEmailError = touched.email && !!emailError
  const showPasswordError = touched.password && !!passwordError

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

  const inputClass = (hasError: boolean) =>
    `w-full rounded-lg border px-4 py-3.5 focus:outline-none ${
      hasError ? 'border-red-400 focus:border-red-400' : 'border-gray-300 focus:border-indigo-500'
    }`

  return (
    <div className="flex min-h-screen justify-center bg-white px-6 py-16">
      <div className="w-full max-w-lg">
        {/* TODO: 로고 svg 에셋 받으면 교체 */}
        <p className="mb-6 text-2xl font-extrabold text-indigo-500">Wordy</p>

        <h1 className="mb-2 text-3xl font-bold">로그인</h1>
        <p className="mb-10 text-gray-500">오늘도 워디를 만나러 오셨군요, 반가워요!</p>

        {/* 이메일 */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          placeholder="이메일을 입력해주세요"
          className={inputClass(showEmailError)}
        />
        <p className="mb-4 mt-1.5 flex h-5 items-center gap-1 text-sm text-red-500">
          {showEmailError && (
            <>
              <span aria-hidden>❗</span>
              {emailError}
            </>
          )}
        </p>

        {/* 비밀번호 */}
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            placeholder="비밀번호를 입력해주세요"
            className={inputClass(showPasswordError)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            aria-label="비밀번호 표시 전환"
          >
            {showPassword ? '🙈' : '👁'}
          </button>
        </div>
        <p className="mb-4 mt-1.5 flex h-5 items-center gap-1 text-sm text-red-500">
          {showPasswordError && (
            <>
              <span aria-hidden>❗</span>
              {passwordError}
            </>
          )}
        </p>

        {/* 기억하기 / 비밀번호 찾기 */}
        <div className="mb-8 flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 accent-indigo-500"
            />
            로그인 정보 기억하기
          </label>
          {/* TODO: 비밀번호 찾기 페이지 라우팅 연결 */}
          <button type="button" className="text-sm text-indigo-500">
            비밀번호 찾기
          </button>
        </div>

        {/* TODO: 공용 컴포넌트(Button) 머지되면 교체 */}
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full rounded-lg bg-indigo-500 py-3.5 font-semibold text-white disabled:bg-gray-300"
        >
          로그인 하기
        </button>

        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-sm text-gray-400">또는</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* TODO: 구글 G 로고 svg 에셋 받으면 교체 */}
        <button
          onClick={handleGoogleLogin}
          className="w-full rounded-lg border border-gray-300 py-3.5 font-medium"
        >
          G Google로 시작하기
        </button>

        <div className="mt-8 flex justify-center gap-2 text-sm text-gray-500">
          <span>아직 회원이 아니신가요?</span>
          {/* TODO: 회원가입 페이지 라우팅 연결 */}
          <button className="font-medium text-indigo-500">회원가입</button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
