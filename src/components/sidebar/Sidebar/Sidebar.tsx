import type { HTMLAttributes, ReactNode } from 'react'
import { SidebarTap } from '../SidebarTap/SidebarTap'
import { SidebarProfile } from '../SidebarProfile/SidebarProfile'
import { SidebarWorkspace } from '../SidebarWorkspace/SidebarWorkspace'
import { SidebarCollapsedHover } from '../SidebarCollapsedHover/SidebarCollapsedHover'
import { IconButton } from '@/components/common/Button/IconButton'
import SidebarIcon from '@/assets/icons/sidebar.svg?react'
import LogoIcon from '@/assets/icons/logo.svg?react'

export type SidebarStatus = 'open' | 'closed'
export type SidebarPage = '홈' | '알림함' | '오늘의 업무' | '일지 모아보기' | '성과 대시보드'

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
  onNotificationClick?: () => void
  onWorkspaceClick?: () => void
  profileMenu?: ReactNode
  notificationMenu?: ReactNode
  workspaceMenu?: ReactNode
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
  onNotificationClick,
  onWorkspaceClick,
  profileMenu,
  notificationMenu,
  workspaceMenu,
  className,
  ...rest
}: SidebarProps) {
  const isOpen = status === 'open'

  return (
    <div
      className={[
        'relative transition-[width] duration-200 ease-out h-screen',
        isOpen
          ? profileMenu || notificationMenu || workspaceMenu
            ? 'w-65 overflow-visible'
            : 'w-65 overflow-hidden'
          : 'w-18 overflow-visible',
        className,
      ].join(' ')}
      {...rest}
    >
      {isOpen ? (
        <div
          className={[
            'bg-(--color-bg-brand-subtle) flex flex-col justify-between items-start py-6 h-full w-full',
            profileMenu || notificationMenu || workspaceMenu
              ? 'overflow-visible'
              : 'overflow-hidden',
          ].join(' ')}
        >
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
            <div className="relative w-full">
              <SidebarWorkspace
                workspaceName={workspaceName}
                isOpen={!!workspaceMenu}
                onClick={onWorkspaceClick}
              />
              {workspaceMenu && (
                <div className="absolute top-full mt-4 left-5 z-40 pointer-events-auto">
                  {workspaceMenu}
                </div>
              )}
            </div>

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
                        onClick={() =>
                          p === '알림함' ? onNotificationClick?.() : onChangePage?.(p)
                        }
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

          {/* 알림함 모달 */}
          {notificationMenu && (
            <div className="absolute top-33 left-full z-40 pl-3">{notificationMenu}</div>
          )}

          {/* 하단 프로필 */}
          <div className="relative w-full">
            {profileMenu && (
              <div className="absolute bottom-full left-0 z-40 px-2 pb-2">{profileMenu}</div>
            )}
            <SidebarProfile
              name={userName}
              plan={userPlan}
              avatarSrc={avatarSrc}
              onClick={onProfileClick}
            />
          </div>
        </div>
      ) : (
        <>
          <SidebarCollapsedHover
            activePage={page}
            pages={pages}
            onNavigate={onChangePage}
            onNotificationClick={onNotificationClick}
            onProfileClick={onProfileClick}
            onExpand={() => onChangeStatus?.('open')}
            avatarSrc={avatarSrc}
          />
          {workspaceMenu && (
            <div className="absolute top-full mt-4 left-5 z-40 pointer-events-auto">
              {workspaceMenu}
            </div>
          )}
          {notificationMenu && (
            <div className="absolute top-33 left-full z-40 pl-3">{notificationMenu}</div>
          )}
          {profileMenu && (
            <div className="absolute bottom-9 left-full z-40 pl-3">{profileMenu}</div>
          )}
        </>
      )}
    </div>
  )
}
