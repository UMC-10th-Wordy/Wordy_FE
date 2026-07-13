import wordyProfileImage from '@/assets/icons/wordy-profile.svg'

interface PerformanceTypingIndicatorProps {
  showProfile?: boolean
}

export const PerformanceTypingIndicator = ({
  showProfile = true,
}: PerformanceTypingIndicatorProps) => {
  return (
    <div className="flex w-full justify-start gap-(--scale-8)">
      {showProfile ? (
        <img
          src={wordyProfileImage}
          alt="Wordy 프로필"
          className="size-(--scale-48) shrink-0 rounded-full"
        />
      ) : (
        <div className="size-(--scale-48) shrink-0" aria-hidden />
      )}

      {/* TODO(#20): 워디 입력 중 모션 에셋 수령 후 점 3개 임시 UI를 실제 모션으로 교체 */}
      <div className="flex h-[61px] min-w-[82px] items-center justify-center gap-(--scale-8) rounded-tl-(--scale-4) rounded-tr-(--scale-16) rounded-br-(--scale-16) rounded-bl-(--scale-16) bg-(--color-bg-brand-light) px-(--scale-16) py-(--scale-16)">
        <span className="size-(--scale-8) rounded-full bg-(--color-icon-default)" />
        <span className="size-(--scale-8) rounded-full bg-(--color-icon-tertiary)" />
        <span className="size-(--scale-8) rounded-full bg-(--color-icon-tertiary)" />
      </div>
    </div>
  )
}
