import type { HTMLAttributes, ReactNode } from 'react'
import { SidebarIcon } from '../SidebarIcon/SidebarIcon'
import { IconButton } from '@/components/common/Button/IconButton'
import SidebarIconSvg from '@/assets/icons/sidebar.svg?react'

export type SidebarPage = '홈' | '알림함' | '오늘의업무' | '일지모아보기' | '성과대시보드'

export interface SidebarCollapsedHoverProps extends HTMLAttributes<HTMLDivElement> {
  activePage?: SidebarPage
  pages?: Array<{ page: SidebarPage; icon: ReactNode; badge?: number }>
  onNavigate?: (page: SidebarPage) => void
  onExpand?: () => void
  avatarSrc?: string
}

export function SidebarCollapsedHover({
  activePage,
  pages = [],
  onNavigate,
  onExpand,
  avatarSrc,
  className,
  ...rest
}: SidebarCollapsedHoverProps) {
  return (
    <div
      className={[
        'bg-(--color-bg-n) flex flex-col items-center justify-between pb-9 pt-5 size-full w-18',
        className,
      ].join(' ')}
      {...rest}
    >
      <div className="flex flex-col gap-8 items-center shrink-0">
        {/* 확장 버튼 */}
        <IconButton
          variant="text_neutral"
          size="small"
          icon={<SidebarIconSvg width={24} height={24} />}
          onClick={onExpand}
          className="bg-(--color-bg-tertiary)"
          aria-label="사이드바 펼치기"
        />

        {/* 페이지 아이콘들 */}
        <div className="absolute flex flex-col gap-2 items-start -left-5 top-16 w-18">
          {pages.map(({ page, icon, badge }) => (
            <SidebarIcon
              key={page}
              icon={icon}
              tooltip={page}
              state={page === activePage ? 'focused' : 'default'}
              dot={badge != null && badge > 0}
              onClick={() => onNavigate?.(page)}
            />
          ))}
        </div>
      </div>

      {/* 하단 아바타 */}
      <div className="shrink-0 size-12 rounded-(--scale-1000) border border-(--color-border-opacity) overflow-hidden">
        {avatarSrc ? (
          <img src={avatarSrc} alt="프로필" className="size-full object-cover" />
        ) : (
          <div className="size-full bg-(--color-bg-secondary)" />
        )}
      </div>
    </div>
  )
}
