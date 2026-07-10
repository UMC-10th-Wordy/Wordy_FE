import { useState } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import { SidebarTap } from '../SidebarTap/SidebarTap'
import { SidebarProfile } from '../SidebarProfile/SidebarProfile'
import { SidebarWorkspace } from '../SidebarWorkspace/SidebarWorkspace'
import { SidebarCollapsedHover } from '../SidebarCollapsedHover/SidebarCollapsedHover'
import { IconButton } from '@/components/common/Button/IconButton'
import SidebarIcon from '@/assets/icons/sidebar.svg?react'
import LogoIcon from '@/assets/icons/logo.svg?react'

export type SidebarStatus = 'open' | 'closed'
export type SidebarPage = '홈' | '알림함' | '오늘의업무' | '일지모아보기' | '성과대시보드'

export type SidebarPageCategory = 'general' | 'feature'

export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  page?: SidebarPage
  status?: SidebarStatus
  pages?: Array<{
    page: SidebarPage
    icon: ReactNode
    badge?: number
    category: SidebarPageCategory
  }>
  workspaceName?: string
  userName?: string
  userPlan?: string
  avatarSrc?: string
  onChangePage?: (page: SidebarPage) => void
  onChangeStatus?: (status: SidebarStatus) => void
  onProfileClick?: () => void
}

export function Sidebar({
  page,
  status = 'open',
  pages = [],
  workspaceName = '',
  userName = '',
  userPlan = '',
  avatarSrc,
  onChangePage,
  onChangeStatus,
  onProfileClick,
  className,
  ...rest
}: SidebarProps) {
  const [hovering, setHovering] = useState(false)
  const isOpen = status === 'open'

  return (
    <div
      className={[
        'relative bg-(--color-bg-brand-subtle) flex flex-col justify-between py-6 h-screen',
        isOpen ? 'overflow-hidden' : hovering ? 'overflow-visible' : 'overflow-hidden',
        'transition-[width] duration-200 ease-out',
        isOpen ? 'items-start w-65' : 'items-center w-18',
        className,
      ].join(' ')}
      onMouseEnter={() => !isOpen && setHovering(true)}
      onMouseLeave={() => !isOpen && setHovering(false)}
      {...rest}
    >
      {isOpen ? (
        <>
          {/* 상단 */}
          <div className="flex flex-col gap-4 items-start shrink-0 w-full">
            {/* 로고 + 토글 */}
            <div className="flex items-center justify-between pl-4 pr-2 shrink-0 w-full">
              <div className="flex items-center justify-center shrink-0">
                <LogoIcon className="h-8 w-[110.857px]" />
              </div>
              <IconButton
                variant="text_neutral"
                size="small"
                icon={<SidebarIcon className="size-6" />}
                onClick={() => onChangeStatus?.('closed')}
                aria-label="사이드바 접기"
              />
            </div>

            {/* 워크스페이스 */}
            <SidebarWorkspace workspaceName={workspaceName} />

            {/* 페이지 탭들 */}
            <div className="flex flex-col gap-7 items-start shrink-0 w-full">
              <div className="flex flex-col gap-1 items-start shrink-0 w-full">
                <div className="flex items-center justify-center pl-4 shrink-0">
                  <span className="[font-size:var(--font-size-body-4)] leading-(--line-height-body) font-semibold text-(--color-text-disabled) whitespace-nowrap">
                    일반
                  </span>
                </div>
                <div className="flex flex-col gap-2 items-start shrink-0 w-full">
                  {pages
                    .filter((p) => p.category === 'general')
                    .map(({ page: p, icon, badge }) => (
                      <SidebarTap
                        key={p}
                        icon={icon}
                        label={p}
                        badge={badge}
                        state={page === p ? 'focused' : 'default'}
                        onClick={() => onChangePage?.(p)}
                      />
                    ))}
                </div>
              </div>

              <div className="flex flex-col gap-1 items-start shrink-0 w-full">
                <div className="flex items-center justify-center pl-4 shrink-0">
                  <span className="[font-size:var(--font-size-body-4)] leading-(--line-height-body) font-semibold text-(--color-text-disabled) whitespace-nowrap">
                    기능
                  </span>
                </div>
                <div className="flex flex-col gap-2 items-start shrink-0 w-full">
                  {pages
                    .filter((p) => p.category === 'feature')
                    .map(({ page: p, icon, badge }) => (
                      <SidebarTap
                        key={p}
                        icon={icon}
                        label={p}
                        badge={badge}
                        state={page === p ? 'focused' : 'default'}
                        onClick={() => onChangePage?.(p)}
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* 하단 프로필 */}
          <SidebarProfile
            name={userName}
            plan={userPlan}
            avatarSrc={avatarSrc}
            onClick={onProfileClick}
          />
        </>
      ) : (
        <>
          {hovering && (
            <div className="absolute left-0 top-0 h-full z-10">
              <SidebarCollapsedHover
                activePage={page}
                pages={pages}
                onNavigate={onChangePage}
                onExpand={() => onChangeStatus?.('open')}
                avatarSrc={avatarSrc}
              />
            </div>
          )}

          {/* Collapsed 상태 기본 뷰 */}
          <div className="flex flex-col gap-8 items-center shrink-0">
            <IconButton
              variant="text_neutral"
              size="small"
              icon={<SidebarIcon className="size-8" />}
              aria-label="사이드바"
            />
          </div>

          <div className="shrink-0 size-12 rounded-(--scale-1000) border border-(--color-border-opacity) overflow-hidden">
            {avatarSrc ? (
              <img src={avatarSrc} alt="프로필" className="size-full object-cover" />
            ) : (
              <div className="size-full bg-(--color-bg-secondary)" />
            )}
          </div>
        </>
      )}
    </div>
  )
}
