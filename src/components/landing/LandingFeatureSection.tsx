import { useState } from 'react'
import DocumentIcon from '@/assets/icons/document.svg?react'
import GenerateIcon from '@/assets/icons/generate.svg?react'
import DashboardIcon from '@/assets/icons/dashboard.svg?react'
import diaryImg from '@/assets/images/landing-feature-diary.png'
import convertImg from '@/assets/images/landing-feature-convert.png'
import dashboardImg from '@/assets/images/landing-feature-dashboard.png'

export type FeatureKey = '업무 일지' | '성과 변환' | '성과 대시보드'

const FEATURES: {
  key: FeatureKey
  icon: (active: boolean) => React.ReactNode
  description: string
  image: string
}[] = [
  {
    key: '업무 일지',
    icon: (active) => (
      <DocumentIcon
        className={`size-8 shrink-0 ${active ? 'text-(--color-icon-brand)' : 'text-(--color-text-default)'}`}
      />
    ),
    description:
      '매일매일의 업무 일지에 프로젝트 태그를 붙여 관리하고, 우선순위를 정해 효율적으로 업무를 해낼 수 있어요.',
    image: diaryImg,
  },
  {
    key: '성과 변환',
    icon: (active) => (
      <GenerateIcon
        className={`size-8 shrink-0 ${active ? 'text-(--color-icon-brand)' : 'text-(--color-text-default)'}`}
      />
    ),
    description:
      '매일 작성한 업무 일지를 성과로 변환해 보세요. 오늘 하루 동안의 성장 인사이트와 성과가 생성돼요.',
    image: convertImg,
  },
  {
    key: '성과 대시보드',
    icon: (active) => (
      <DashboardIcon
        className={`size-8 shrink-0 ${active ? 'text-(--color-icon-brand)' : 'text-(--color-text-default)'}`}
      />
    ),
    description:
      '성과 지표로 변환된 업무 일지를 바탕으로 데이터를 도출해요. 주간 성과와 누적 KPI를 한 눈에 파악할 수 있어요.',
    image: dashboardImg,
  },
]

interface LandingFeatureSectionProps {
  activeFeature?: FeatureKey
  onActiveChange?: (key: FeatureKey) => void
}

export function LandingFeatureSection({
  activeFeature,
  onActiveChange,
}: LandingFeatureSectionProps) {
  const [internalActive, setInternalActive] = useState<FeatureKey>('업무 일지')
  const [transitionDuration, setTransitionDuration] = useState<'duration-100' | 'duration-200'>(
    'duration-200',
  )
  const active = activeFeature ?? internalActive
  const setActive = (key: FeatureKey) => {
    setTransitionDuration(key === '업무 일지' ? 'duration-100' : 'duration-200')
    setInternalActive(key)
    onActiveChange?.(key)
  }

  return (
    <div className="flex w-full max-w-330 h-151.25 items-start gap-10 rounded-(--scale-20) border-[0.5px] border-(--color-border-brand-subtle) bg-(--color-bg-default) p-10 shadow-[0px_1px_5px_0px_rgba(0,0,0,0.1)]">
      {/* 좌측 아코디언 메뉴 — justify-center로 수직 중앙 */}
      <div className="flex h-full w-80.75 shrink-0 flex-col gap-5 justify-center">
        {FEATURES.map((f, i) => {
          const isActive = active === f.key
          return (
            <div key={f.key} className="flex flex-col gap-5">
              {i > 0 && <div className="h-px w-full bg-(--color-border-brand-subtle)" />}
              <button
                type="button"
                onClick={() => setActive(f.key)}
                disabled={isActive}
                className="flex flex-col gap-2 items-start text-left"
              >
                {f.icon(isActive)}
                <p className="[font-size:var(--font-size-heading-4)] font-semibold leading-(--line-height-body) text-(--color-text-default)">
                  {f.key}
                </p>
                {/* 설명 — max-h로 펼침/접힘 애니메이션 */}
                <div
                  className={`overflow-hidden transition-all ${transitionDuration} ease-out ${isActive ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="[font-size:var(--font-size-body-1)] font-medium leading-(--line-height-body) text-(--color-text-tertiary)">
                    {f.description}
                  </p>
                </div>
              </button>
            </div>
          )
        })}
      </div>

      {/* 우측 이미지 — fade + slide 전환 */}
      <div className="relative min-w-0 flex-1 h-full">
        {FEATURES.map((f) => (
          <img
            key={f.key}
            src={f.image}
            alt={`${f.key} 화면`}
            className={`absolute inset-0 w-full h-full object-cover rounded-xl shadow-[0px_1px_15px_0px_rgba(0,0,0,0.1)] transition-all ${transitionDuration} ease-out`}
            style={{
              opacity: f.key === active ? 1 : 0,
              transform: f.key === active ? 'translateY(0)' : 'translateY(8px)',
              pointerEvents: f.key === active ? 'auto' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  )
}
