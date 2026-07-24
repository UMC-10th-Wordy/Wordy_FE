import { useEffect, useRef, useState } from 'react'
import { OnboardingCard } from '@/components/auth/OnboardingCard'
import { CAREER_OPTIONS, JOB_OPTIONS } from '@/components/auth/onboarding'
import type { CareerOption, JobOption } from '@/components/auth/onboarding'
import ProfileDefaultIcon from '@/assets/icons/profile-default.svg?react'
import CameraBadgeIcon from '@/assets/icons/camera-badge.svg?react'
import { useNavigate } from 'react-router-dom'

export const ProfileSetupPage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [career, setCareer] = useState<CareerOption | null>(null)
  const [job, setJob] = useState<JobOption | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // photoUrl 변경/언마운트 시 이전 blob URL 해제 (메모리 누수 방지)
  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl)
    }
  }, [photoUrl])

  const handlePhotoChange = (file: File | undefined) => {
    if (!file) return
    // TODO(#40): API 연동 시 업로드 요청으로 교체. 현재는 로컬 미리보기만
    setPhotoUrl(URL.createObjectURL(file))
  }

  const handleComplete = () => {
    // TODO(#40): API 연동 시 프로필 저장 요청 후 홈으로 이동
    navigate('/')
  }

  if (step === 0) {
    return (
      <OnboardingCard
        title="프로필 등록"
        description={
          <>
            입력된 정보는 맞춤형 서비스 제공을 위해 사용되며
            <br />
            나중에 변경할 수 있어요
          </>
        }
        step={0}
        totalSteps={3}
        nextDisabled={!name.trim()}
        onNext={() => setStep(1)}
      >
        <div className="flex w-full flex-col items-center gap-12">
          <button
            type="button"
            className="relative"
            onClick={() => fileInputRef.current?.click()}
            aria-label="프로필 사진 업로드"
          >
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="프로필 미리보기"
                className="size-[160px] rounded-full object-cover"
              />
            ) : (
              <ProfileDefaultIcon width={160} height={160} />
            )}
            <CameraBadgeIcon width={40} height={40} className="absolute bottom-1 right-1" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handlePhotoChange(e.target.files?.[0])}
          />

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="닉네임을 입력해 주세요"
            aria-label="이름"
            className="w-full rounded-lg border border-(--color-border-subtle) px-5 py-4 text-(--color-text-default) placeholder:text-(--color-text-tertiary) focus:border-(--color-border-brand) focus:outline-none"
          />
        </div>
      </OnboardingCard>
    )
  }

  if (step === 1) {
    return (
      <OnboardingCard
        title="재직 연차 선택"
        description={
          <>
            입력된 정보는 맞춤형 서비스 제공을 위해 사용되며
            <br />
            나중에 변경할 수 있어요
          </>
        }
        step={1}
        totalSteps={3}
        nextDisabled={!career}
        onPrev={() => setStep(0)}
        onNext={() => setStep(2)}
      >
        <div className="flex w-full flex-col gap-5">
          {CAREER_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={career === option}
              onClick={() => setCareer(option)}
              className={[
                'flex h-[56px] w-full items-center justify-center rounded-lg px-5 transition-colors duration-100 ease-out',
                career === option
                  ? 'bg-(--primitive-primary-300) text-(--color-text-default)'
                  : 'bg-(--color-bg-secondary) text-(--color-text-default) hover:bg-(--color-bg-tertiary)',
              ].join(' ')}
            >
              {option}
            </button>
          ))}
        </div>
      </OnboardingCard>
    )
  }

  return (
    <OnboardingCard
      title="직무 선택"
      description={
        <>
          입력된 정보는 맞춤형 서비스 제공을 위해 사용되며
          <br />
          나중에 변경할 수 있어요
        </>
      }
      step={2}
      totalSteps={3}
      nextLabel="시작하기"
      nextDisabled={!job}
      onPrev={() => setStep(1)}
      onNext={handleComplete}
    >
      <div className="flex w-full flex-wrap content-start gap-5">
        {JOB_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={job === option}
            onClick={() => setJob(option)}
            className={[
              'flex h-[56px] items-center justify-center rounded-lg px-5 transition-colors duration-100 ease-out',
              job === option
                ? 'bg-(--primitive-primary-300) text-(--color-text-default)'
                : 'bg-(--color-bg-secondary) text-(--color-text-default) hover:bg-(--color-bg-tertiary)',
            ].join(' ')}
          >
            {option}
          </button>
        ))}
      </div>
    </OnboardingCard>
  )
}
