import type { HTMLAttributes } from 'react'
import { SidebarNavItemText } from '../SidebarNavItemText/SidebarNavItemText'

export interface TrashMoreMenuProps extends HTMLAttributes<HTMLDivElement> {
  onRestore?: () => void
  onDeletePermanently?: () => void
}

export function TrashMoreMenu({
  onRestore,
  onDeletePermanently,
  className,
  ...rest
}: TrashMoreMenuProps) {
  return (
    <div
      className={[
        'bg-(--color-bg-default) rounded-[var(--scale-12)] shadow-[0px_1px_7.5px_rgba(0,0,0,0.1)]',
        'flex flex-col items-start justify-center px-4 py-3 w-55',
        className,
      ].join(' ')}
      {...rest}
    >
      <SidebarNavItemText label="복원하기" onClick={onRestore} />
      <SidebarNavItemText label="영구 삭제하기" onClick={onDeletePermanently} />
    </div>
  )
}
