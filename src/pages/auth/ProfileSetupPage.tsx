import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { OnboardingCard } from '@/components/auth/OnboardingCard'
import {
  CAREER_OPTIONS,
  CAREER_TO_YEARS_OF_SERVICE,
  JOB_OPTIONS,
  JOB_TO_JOB_ROLE,
} from '@/constants/onboarding'
import type { CareerOption, JobOption } from '@/constants/onboarding'
import ProfileDefaultIcon from '@/assets/icons/profile-default.svg?react'
import CameraBadgeIcon from '@/assets/icons/camera-badge.svg?react'
import { useNavigate } from 'react-router-dom'
import { postProfile, postProfileImage, userQueryKeys } from '@/api/user/user'
import { getHome, homeQueryKeys } from '@/api/home/home'
import { useGetProfile } from '@/hooks/useUserQueries'

export const ProfileSetupPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: profileData, isLoading: isProfileLoading } = useGetProfile({ retry: false })
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [career, setCareer] = useState<CareerOption | null>(null)
  const [job, setJob] = useState<JobOption | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadedImageRef = useRef<{ file: File; url: string } | null>(null)

  // photoUrl 변경/언마운트 시 이전 blob URL 해제 (메모리 누수 방지)
  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl)
    }
  }, [photoUrl])

  // 이미 프로필을 등록한 사용자는 다시 접근할 수 없도록 홈으로 리다이렉트
  useEffect(() => {
    if (profileData?.userName) {
      navigate('/', { replace: true })
    }
  }, [profileData, navigate])

  const handlePhotoChange = (file: File | undefined) => {
    if (!file) return
    setPhotoFile(file)
    setPhotoUrl(URL.createObjectURL(file))
  }

  const handleComplete = async () => {
    if (!career || !job) return

    setIsSubmitting(true)
    try {
      let profileImgUrl: string | undefined
      if (photoFile) {
        if (uploadedImageRef.current?.file === photoFile) {
          profileImgUrl = uploadedImageRef.current.url
        } else {
          const uploadResult = await postProfileImage(photoFile)
          profileImgUrl = uploadResult.profileImgUrl
          uploadedImageRef.current = { file: photoFile, url: profileImgUrl }
        }
      }

      await postProfile({
        userName: name,
        profileImgUrl,
        yearsOfService: CAREER_TO_YEARS_OF_SERVICE[career],
        jobRole: JOB_TO_JOB_ROLE[job],
      })

      // 홈 데이터를 먼저 캐싱한 뒤 프로필을 무효화해야 함:
      // invalidateQueries는 현재 활성화된 profile 쿼리의 리페치까지 기다리는데,
      // 리페치 완료 시 profileData.userName이 채워지며 위 useEffect가 반응형으로 navigate('/')를 먼저 실행해버려
      // 아래 prefetchQuery가 끝나기 전에 홈으로 이동해 Suspense가 깜빡이는 문제가 있었음
      // 홈 페이지 청크도 함께 미리 받아둬서 이동 직후 로딩 표시가 뜨지 않게 함
      await Promise.all([
        queryClient.prefetchQuery({ queryKey: homeQueryKeys.all, queryFn: getHome }),
        import('@/pages/HomePage'),
      ])
      await queryClient.invalidateQueries({ queryKey: userQueryKeys.profile() })
      navigate('/')
    } catch {
      alert('프로필 등록에 실패했어요. 다시 시도해 주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isProfileLoading || profileData?.userName) {
    return null
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
            maxLength={5}
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
      nextDisabled={!job || isSubmitting}
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
