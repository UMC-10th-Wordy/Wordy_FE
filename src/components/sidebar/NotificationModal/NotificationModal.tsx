import type { HTMLAttributes } from 'react'
import { NotificationItem, type NotificationItemProps } from '../NotificationItem/NotificationItem'
import { IconButton } from '@/components/common/Button/IconButton'
import XMarkIcon from '@/assets/icons/x-mark.svg?react'

export interface NotificationModalProps extends HTMLAttributes<HTMLDivElement> {
  isEmpty?: boolean
  notifications?: NotificationItemProps[]
  onClose?: () => void
}

export function NotificationModal({
  isEmpty = false,
  notifications = [],
  onClose,
  className,
  ...rest
}: NotificationModalProps) {
  return (
    <div
      className={[
        'bg-(--color-bg-default) rounded-(--scale-12) shadow-[0px_1px_15px_rgba(0,0,0,0.1)]',
        'flex flex-col gap-5 items-start px-3 py-5 w-full max-w-113.25 h-full max-h-150',
        className,
      ].join(' ')}
      {...rest}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between pl-2 shrink-0 w-full">
        <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-semibold text-(--color-text-secondary) whitespace-nowrap">
          알림함
        </span>
        <IconButton
          variant="text_neutral"
          size="medium"
          icon={<XMarkIcon width={32} height={32} />}
          onClick={onClose}
          aria-label="닫기"
        />
      </div>

      {/* 콘텐츠 */}
      <div className="flex flex-1 min-h-0 w-full">
        {isEmpty ? (
          <div className="flex items-center justify-center flex-1 [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-tertiary) text-center">
            최근 14일 간<br />
            알림이 오지 않았어요
          </div>
        ) : (
          <div className="flex flex-col gap-2 items-start flex-1 min-h-0 overflow-y-auto">
            {notifications.map((notification, index) => (
              <NotificationItem key={index} {...notification} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
