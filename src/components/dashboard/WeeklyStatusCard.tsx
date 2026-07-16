import { TextButton } from '@/components/common/Button/TextButton'
import GenerateIcon from '@/assets/icons/generate.svg?react'
import WordySleepingIcon from '@/assets/icons/wordy-sleeping.svg?react'
import WordyReadyIcon from '@/assets/icons/wordy-ready.svg?react'
import WordyGeneratingIcon from '@/assets/icons/wordy-generating.svg?react'
import type { WeeklyDashboardStatus } from './dashboard.types'

interface WeeklyStatusCardProps {
  status: Exclude<WeeklyDashboardStatus, 'complete'>
  convertedCount: number
  onGenerate: () => void
}

export const WeeklyStatusCard = ({ status, convertedCount, onGenerate }: WeeklyStatusCardProps) => {
  return (
    <section className="flex h-[748px] min-w-[1047px] max-w-[1172px] flex-1 shrink-0 flex-col items-center justify-center gap-[56px] rounded-xl border border-(--color-border-subtle) bg-(--color-bg-default) px-5 py-10">
      {status === 'insufficient' && (
        <div className="flex flex-col items-center gap-8">
          <WordySleepingIcon width={220} height={220} className="shrink-0" />
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="[font-size:var(--font-size-heading-4)] font-bold text-(--color-text-default)">
              이번 주의 대시보드를 아직 생성할 수 없어요
            </h2>
            <p className="[font-size:var(--font-size-body-3)] text-(--color-text-secondary)">
              조금만 더 기록해 볼까요?
              <br />
              주간 대시보드는 변환된 업무 일지가{' '}
              <span className="font-semibold text-(--color-text-brand)">3개 이상 모이면</span> 만들
              수 있어요
            </p>
            <p className="[font-size:var(--font-size-caption-1)] text-(--color-text-tertiary)">
              *전체 일수가 3일보다 적은 주차에는 모두 변환 시 만들 수 있어요
            </p>
          </div>
          <TextButton
            variant="fill"
            size="large"
            disabled
            iconLeft={<GenerateIcon width={20} height={20} />}
            className="w-[400px]"
          >
            주간 대시보드 생성하기
          </TextButton>
        </div>
      )}

      {status === 'ready' && (
        <div className="flex flex-col items-center gap-8">
          <WordyReadyIcon width={220} height={220} className="shrink-0" />
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="[font-size:var(--font-size-heading-4)] font-bold text-(--color-text-default)">
              이번 주의 대시보드를 생성할 준비가 되었어요
            </h2>
            <p className="[font-size:var(--font-size-body-3)] text-(--color-text-secondary)">
              저장된{' '}
              <span className="font-semibold text-(--color-text-brand)">
                업무일지 {convertedCount}개
              </span>
              를 바탕으로 이번 주의 업무 및 KPI 추적 결과를 정리해드릴게요
            </p>
          </div>
          <TextButton
            variant="fill"
            size="large"
            iconLeft={<GenerateIcon width={20} height={20} />}
            onClick={onGenerate}
            className="w-[400px]"
          >
            주간 대시보드 생성하기
          </TextButton>
        </div>
      )}

      {status === 'generating' && (
        <div className="flex flex-col items-center gap-8">
          <WordyGeneratingIcon width={220} height={220} className="shrink-0" />
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="[font-size:var(--font-size-heading-4)] font-bold text-(--color-text-default)">
              워디가 열심히 만들고 있어요.
              <br />
              페이지를 이동하지 말고 잠시만 기다려 주세요.
            </h2>
            <p className="[font-size:var(--font-size-body-3)] text-(--color-text-secondary)">
              생성은 <span className="font-semibold text-(--color-text-brand)">최대 1분</span> 정도
              걸릴 수 있어요
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
