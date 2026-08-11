import { useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { OnboardingCard } from '@/components/auth/OnboardingCard'
import { Input1 } from '@/components/common/Input/Input1'
import { Chip } from '@/components/common/Chip/Chip'
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
import { homeQueryKeys } from '@/api/home/home'
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

      // 프로필을 무효화하면 리페치가 끝난 뒤 profileData.userName이 채워지고
      // 위 useEffect가 반응형으로 navigate('/')를 실행함 (이동은 그 useEffect가 담당)
      // throwOnError를 지정하지 않으면 리페치 실패가 조용히 삼켜져 catch 블록이 실행되지 않음
      await queryClient.invalidateQueries(
        { queryKey: userQueryKeys.profile() },
        { throwOnError: true },
      )
      // 홈 화면 캐시도 함께 무효화해야 이동 직후 이름이 정상 반영됨
      await queryClient.invalidateQueries({ queryKey: homeQueryKeys.all })
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
        <div className="flex w-full flex-col items-center gap-20">
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
                className="size-40 rounded-full object-cover"
              />
            ) : (
              <ProfileDefaultIcon width={160} height={160} />
            )}
            <CameraBadgeIcon width={52} height={52} className="absolute -bottom-0.5 -right-0.5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handlePhotoChange(e.target.files?.[0])}
          />

          <div className="flex w-full flex-col gap-2">
            <Input1
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="닉네임을 입력해 주세요"
              aria-label="닉네임"
              maxLength={10}
            />
            <div className="flex w-full flex-col rounded-lg bg-(--color-bg-secondary) p-2 [font-size:var(--font-size-body-4)] leading-(--line-height-body) text-(--color-text-tertiary)">
              <ul className="list-disc pl-5">
                <li>공백 포함 10글자 이내로 입력해 주세요</li>
                <li>특수문자를 제외한 숫자, 한글, 영문만 입력할 수 있어요</li>
              </ul>
            </div>
          </div>
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
            <Chip
              key={option}
              variant="rectangle"
              focused={career === option}
              onClick={() => setCareer(option)}
              className="w-full"
            >
              {option}
            </Chip>
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
      <div className="flex w-full flex-wrap content-start gap-x-5 gap-y-6">
        {JOB_OPTIONS.map((option) => (
          <Chip
            key={option}
            variant="rectangle"
            focused={job === option}
            onClick={() => setJob(option)}
          >
            {option}
          </Chip>
        ))}
      </div>
    </OnboardingCard>
  )
}
