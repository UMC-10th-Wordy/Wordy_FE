import LogoIcon from '@/assets/icons/logo.svg?react'
import InstagramIcon from '@/assets/icons/instagram.svg?react'
import type { FeatureKey } from './LandingFeatureSection'

interface LandingFooterProps {
  onNavigate?: (section: '홈' | '기능 소개' | '요금제 안내') => void
  onNavigateToFeature?: (feature: FeatureKey) => void
}

export function LandingFooter({ onNavigate, onNavigateToFeature }: LandingFooterProps) {
  return (
    <footer className="flex w-full flex-col gap-20 bg-(--color-bg-secondary) px-10 pb-10 pt-20">
      <div className="flex gap-20">
        {/* 로고 + 설명 + 인스타 */}
        <div className="flex flex-col gap-8 shrink-0">
          <LogoIcon className="h-8 w-[110.857px]" />
          <p className="[font-size:var(--font-size-body-3)] font-medium leading-(--line-height-body) text-(--color-text-secondary)">
            일상의 업무를 나만의 성과로,
            <br />
            AI 업무 파트너 Wordy
          </p>
          <div className="flex items-center gap-1">
            <InstagramIcon className="size-6 text-(--color-text-secondary)" />
            <span className="[font-size:var(--font-size-body-3)] font-medium leading-(--line-height-body) text-(--color-text-secondary)">
              Instagram
            </span>
          </div>
        </div>

        {/* 링크 그룹 */}
        <div className="flex gap-20">
          <div className="flex flex-col gap-5">
            <p className="[font-size:var(--font-size-body-2)] font-medium leading-(--line-height-body) text-(--color-text-tertiary) whitespace-nowrap">
              기능
            </p>
            {(['업무 일지', '성과 변환', '성과 대시보드'] as const).map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => onNavigateToFeature?.(label)}
                className="[font-size:var(--font-size-body-3)] font-medium leading-(--line-height-body) text-(--color-text-secondary) whitespace-nowrap hover:text-(--color-text-default) text-left"
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-5">
            <p className="[font-size:var(--font-size-body-2)] font-medium leading-(--line-height-body) text-(--color-text-tertiary) whitespace-nowrap">
              고객 지원
            </p>
            <button
              type="button"
              className="[font-size:var(--font-size-body-3)] font-medium leading-(--line-height-body) text-(--color-text-secondary) whitespace-nowrap hover:text-(--color-text-default) text-left"
            >
              문의 및 피드백 하기
            </button>
          </div>
          <div className="flex flex-col gap-5">
            <p className="[font-size:var(--font-size-body-2)] font-medium leading-(--line-height-body) text-(--color-text-tertiary) whitespace-nowrap">
              요금제
            </p>
            <button
              type="button"
              onClick={() => onNavigate?.('요금제 안내')}
              className="[font-size:var(--font-size-body-3)] font-medium leading-(--line-height-body) text-(--color-text-secondary) whitespace-nowrap hover:text-(--color-text-default) text-left"
            >
              요금제 안내
            </button>
          </div>
        </div>
      </div>

      {/* 하단 카피라이트 */}
      <div className="flex items-center gap-10">
        <span className="[font-size:var(--font-size-body-3)] font-medium leading-(--line-height-body) text-(--color-text-tertiary) whitespace-nowrap">
          © 2026 Wordy, All rights reserved.
        </span>
        <button
          type="button"
          className="[font-size:var(--font-size-body-3)] font-medium leading-(--line-height-body) text-(--color-text-tertiary) whitespace-nowrap hover:text-(--color-text-secondary)"
        >
          개인정보처리방침
        </button>
        <button
          type="button"
          className="[font-size:var(--font-size-body-3)] font-medium leading-(--line-height-body) text-(--color-text-tertiary) whitespace-nowrap hover:text-(--color-text-secondary)"
        >
          서비스이용약관
        </button>
      </div>
    </footer>
  )
}
