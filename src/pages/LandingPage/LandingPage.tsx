import { useRef, useState, useEffect, useCallback } from 'react'
import { animate, type AnimationPlaybackControls } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { LandingHeader } from '@/components/landing/LandingHeader'
import { LandingHeroSection } from '@/components/landing/LandingHeroSection'
import { LandingScrollCardsSection } from '@/components/landing/LandingScrollCardsSection'
import { LandingFeatureSection } from '@/components/landing/LandingFeatureSection'
import { LandingPricingSection } from '@/components/landing/LandingPricingSection'
import { LandingCTASection } from '@/components/landing/LandingCTASection'
import { LandingFooter } from '@/components/landing/LandingFooter'
import type { FeatureKey } from '@/components/landing/LandingFeatureSection'

type LandingPage = '홈' | '기능 소개' | '요금제 안내'

export function LandingPage() {
  const navigate = useNavigate()
  const featureRef = useRef<HTMLElement>(null)
  const pricingRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState<LandingPage>('홈')
  const [activeFeature, setActiveFeature] = useState<FeatureKey>('업무 일지')
  const scrollAnimationRef = useRef<AnimationPlaybackControls | null>(null)

  const scrollToSection = useCallback(
    (ref: React.RefObject<HTMLElement | HTMLDivElement | null>) => {
      const target = ref.current
      if (!target) return

      let container: Element | null = target.parentElement
      while (container) {
        const { overflowY } = getComputedStyle(container)
        if (overflowY === 'scroll' || overflowY === 'auto') break
        container = container.parentElement
      }
      if (!container) return

      scrollAnimationRef.current?.stop()

      const targetY =
        container.scrollTop +
        target.getBoundingClientRect().top -
        container.getBoundingClientRect().top
      scrollAnimationRef.current = animate(container.scrollTop, targetY, {
        duration: 0.3,
        ease: 'easeOut',
        onUpdate: (v) => {
          container!.scrollTop = v
        },
      })
    },
    [],
  )

  const handleNavigate = useCallback(
    (page: LandingPage) => {
      // TODO: 로그인 상태일 경우 '홈' 클릭 시 /로 이동 (API 연동 후 처리)
      if (page === '홈') scrollToSection(heroRef)
      if (page === '기능 소개') scrollToSection(featureRef)
      if (page === '요금제 안내') scrollToSection(pricingRef)
    },
    [scrollToSection],
  )

  const handleNavigateToFeature = useCallback(
    (feature: FeatureKey) => {
      setActiveFeature(feature)
      scrollToSection(featureRef)
    },
    [scrollToSection],
  )

  // 스크롤 위치 기반으로 헤더 active 자동 변경
  useEffect(() => {
    const visibilityMap = new Map<Element, boolean>()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibilityMap.set(entry.target, entry.isIntersecting)
        })

        if (visibilityMap.get(pricingRef.current!)) setCurrentPage('요금제 안내')
        else if (visibilityMap.get(featureRef.current!)) setCurrentPage('기능 소개')
        else if (visibilityMap.get(heroRef.current!)) setCurrentPage('홈')
      },
      { threshold: 0.3 },
    )

    if (heroRef.current) observer.observe(heroRef.current)
    if (featureRef.current) observer.observe(featureRef.current)
    if (pricingRef.current) observer.observe(pricingRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-(--color-bg-default)">
      {/* 히어로 영역 — 배경 그라디언트 + 헤더 포함 */}
      <div
        ref={heroRef}
        className="relative w-full shrink-0"
        style={{
          backgroundImage: [
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 900' preserveAspectRatio='none'><g transform='matrix(-47.75 69.663 -17.833 -41.406 218 203.37)'><foreignObject x='-541.21' y='-541.21' width='1082.4' height='1082.4'><div xmlns='http://www.w3.org/1999/xhtml' style='background-image: conic-gradient(from 90deg, rgb(244, 238, 255) -7.4393%, rgb(217, 228, 255) 3.7091%, rgb(217, 248, 255) 31.924%, rgba(217, 248, 255, 0) 55.37%, rgba(244, 238, 255, 0) 70.649%, rgb(244, 238, 255) 92.561%, rgb(217, 228, 255) 103.71%); opacity:1; height: 100%; width: 100%;'></div></foreignObject></g></svg>\")",
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 900' preserveAspectRatio='none'><g transform='matrix(44 -17.669 4.523 38.154 1524.5 751.84)'><foreignObject x='-385.4' y='-385.4' width='770.79' height='770.79'><div xmlns='http://www.w3.org/1999/xhtml' style='background-image: conic-gradient(from 90deg, rgb(244, 238, 255) -7.4393%, rgb(217, 228, 255) 3.7091%, rgb(217, 248, 255) 31.924%, rgb(255, 255, 255) 55.37%, rgb(255, 255, 255) 70.649%, rgb(244, 238, 255) 92.561%, rgb(217, 228, 255) 103.71%); opacity:1; height: 100%; width: 100%;'></div></foreignObject></g></svg>\")",
          ].join(', '),
        }}
      >
        {/* TODO: 로그인 상태 연동 후 isLoggedIn prop 전달 및 로그인 시 로그인 버튼 숨김 처리 (API 연동 후 처리) */}
        <LandingHeader
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onSignup={() => navigate('/signup')}
          onLogin={() => navigate('/login')}
        />
        <LandingHeroSection onStart={() => navigate('/signup')} />
      </div>

      <LandingScrollCardsSection />

      <section
        ref={featureRef}
        className="flex w-full flex-col items-center gap-12 bg-(--color-bg-brand-subtle) px-10 py-15"
      >
        <div className="flex flex-col items-center whitespace-nowrap">
          <p className="[font-size:var(--font-size-heading-2)] font-semibold leading-(--line-height-body) text-(--color-text-default)">
            Wordy는 이런 기능을 제공해요!
          </p>
          <p className="[font-size:var(--font-size-body-1)] font-medium leading-(--line-height-body) text-(--color-text-tertiary)">
            기록은 열심히 하지만, 정작 내 성과가 무엇인지 파악하기 어렵나요?
          </p>
        </div>
        <LandingFeatureSection activeFeature={activeFeature} onActiveChange={setActiveFeature} />
      </section>

      <div ref={pricingRef}>
        <LandingPricingSection onStart={() => navigate('/signup')} />
      </div>

      <LandingCTASection onStart={() => navigate('/signup')} />
      <LandingFooter onNavigate={handleNavigate} onNavigateToFeature={handleNavigateToFeature} />
    </div>
  )
}
