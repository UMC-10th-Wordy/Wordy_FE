import { useNavigate } from 'react-router-dom'
import { IconButton } from '@/components/common/Button/IconButton'
import { TextButton } from '@/components/common/Button/TextButton'
import ArrowLeftIcon from '@/assets/icons/Direction=left.svg?react'
import CheckIcon from '@/assets/icons/check.svg?react'

interface PlanFeature {
  text: string
  subText?: string
  bold?: boolean
}

const FREE_FEATURES: PlanFeature[] = [
  { text: 'AI 기반 성과 변환 기능 ', subText: '(일일 사용 횟수 제한)' },
  { text: '주간 성과 대시보드 생성' },
  { text: '프로젝트 및 업무 기록 기능' },
  { text: '제한된 워크 스페이스 갯수' },
]

const PRO_FEATURES: PlanFeature[] = [
  { text: 'Free 플랜의 모든 기능', bold: true },
  { text: '무제한 AI 기반 성과 변환 기능' },
  { text: '무제한 워크 스페이스 관리' },
  { text: '고도화된 주간·월간 성과 대시보드 생성' },
  { text: '업무 내용 기반 포트폴리오 자동 생성' },
  { text: 'PDF로 데이터 내보내기' },
]

export function PlanPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-10 items-start p-10 min-h-full w-full bg-(--color-bg-brand-subtle)">
      {/* 뒤로 가기 */}
      <div className="flex gap-2 items-center shrink-0">
        <IconButton
          variant="text_neutral"
          size="large"
          icon={<ArrowLeftIcon className="size-10" />}
          onClick={() => navigate('/')}
          aria-label="뒤로 가기"
        />
        <span className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-medium text-(--color-text-secondary) whitespace-nowrap">
          뒤로 가기
        </span>
      </div>

      {/* 컨텐츠 */}
      <div className="flex flex-col gap-10 items-start w-full max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="flex flex-col gap-1 items-start shrink-0">
          <h2 className="[font-size:var(--font-size-heading-2)] leading-(--line-height-body) font-semibold text-(--color-text-default)">
            요금제
          </h2>
          <p className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-tertiary)">
            기본 업무 일지 관리부터 성과 도출까지, 필요에 맞는 플랜을 선택하세요
          </p>
        </div>

        {/* 카드 목록 */}
        <div className="flex gap-8 w-full h-145">
          {/* Free 카드 */}
          <div className="flex flex-1 flex-col justify-between bg-(--color-bg-default) border border-(--color-border-brand-subtle) rounded-(--scale-16) shadow-[0px_1px_5px_rgba(0,0,0,0.1)] p-8 overflow-hidden">
            <div className="flex flex-col gap-4 items-start w-full">
              <div className="flex flex-col gap-8 items-start w-full">
                {/* 플랜명 + 현재 플랜 뱃지 */}
                <div className="flex items-start justify-between w-full">
                  <div className="flex flex-col items-start">
                    <span className="[font-size:var(--font-size-heading-2)] leading-(--line-height-body) font-semibold text-(--color-text-brand)">
                      Free
                    </span>
                    <span className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-medium text-(--color-text-tertiary)">
                      누구나 부담없이 시작해요!
                    </span>
                  </div>
                  <div className="flex items-center justify-center px-3 py-2 bg-(--color-tag-navy-bg) rounded-lg shrink-0">
                    <span className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-semibold text-(--color-tag-navy-text)">
                      현재 플랜
                    </span>
                  </div>
                </div>
                {/* 가격 */}
                <span className="[font-size:var(--font-size-heading-1)] leading-(--line-height-body) font-semibold text-(--color-text-default)">
                  0원
                </span>
              </div>
              {/* 기능 목록 */}
              <div className="flex flex-col gap-3 items-start">
                {FREE_FEATURES.map((feature) => (
                  <div key={feature.text} className="flex gap-1 items-center">
                    <CheckIcon className="size-8 shrink-0 text-(--color-icon-brand)" />
                    <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-default)">
                      {feature.text}
                      {feature.subText && (
                        <span className="text-(--color-text-tertiary)">{feature.subText}</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* 버튼 */}
            <TextButton variant="stroke" size="large" fullWidth onClick={() => navigate('/')}>
              무료로 사용하기
            </TextButton>
          </div>

          {/* Pro 카드 */}
          <div
            className="flex flex-1 flex-col justify-between border-[1.5px] border-(--color-border-brand) rounded-(--scale-16) shadow-[0px_1px_5px_rgba(0,0,0,0.1)] p-8 relative overflow-hidden"
            style={{
              background:
                'linear-gradient(132.9deg, rgba(221,221,255,0.3) 0%, rgba(250,250,252,0.3) 100%)',
            }}
          >
            {/* COMING SOON 배너 */}
            <div className="absolute top-0 right-0 z-10 pointer-events-none overflow-hidden size-50">
              <div className="absolute top-10 -right-20 w-70 rotate-45 flex items-center justify-center bg-(--color-icon-brand) px-3 py-2">
                <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-semibold text-(--color-text-inverse) whitespace-nowrap">
                  COMING SOON
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4 items-start w-full">
              <div className="flex flex-col gap-8 items-start w-full">
                {/* 플랜명 */}
                <div className="flex flex-col items-start">
                  <span className="[font-size:var(--font-size-heading-2)] leading-(--line-height-body) font-semibold text-(--color-text-brand)">
                    Pro
                  </span>
                  <span className="[font-size:var(--font-size-body-1)] leading-(--line-height-body) font-medium text-(--color-text-tertiary)">
                    압도적인 생산성 향상을 경험해 보세요
                  </span>
                </div>
                {/* 가격 */}
                <span className="[font-size:var(--font-size-heading-1)] leading-(--line-height-body) font-semibold text-(--color-text-default)">
                  오픈 예정이에요
                </span>
              </div>
              {/* 기능 목록 */}
              <div className="flex flex-col gap-3 items-start">
                {PRO_FEATURES.map((feature) => (
                  <div key={feature.text} className="flex gap-1 items-center">
                    <CheckIcon className="size-8 shrink-0 text-(--color-icon-brand)" />
                    <span
                      className={`[font-size:var(--font-size-body-2)] leading-(--line-height-body) ${feature.bold ? 'font-medium' : 'font-normal'} text-(--color-text-default)`}
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* 버튼 */}
            <TextButton variant="fill" size="large" fullWidth disabled>
              아직 사용할 수 없어요
            </TextButton>
          </div>
        </div>
      </div>
    </div>
  )
}
