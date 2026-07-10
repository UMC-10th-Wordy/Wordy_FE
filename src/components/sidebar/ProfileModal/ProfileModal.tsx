import { useRef } from 'react'
import type { HTMLAttributes } from 'react'
import { SidebarMenu } from '../SidebarMenu/SidebarMenu'
import type { SidebarMenuItem } from '../SidebarMenu/SidebarMenu'
import TrashIcon from '@/assets/icons/trash.svg?react'
import SettingIcon from '@/assets/icons/setting.svg?react'

export interface ProfileModalProps extends HTMLAttributes<HTMLDivElement> {
  email: string
  onTrash?: () => void
  onPlan?: () => void
  onSetting?: () => void
  onLogout?: () => void
  onClose?: () => void
}

export function ProfileModal({
  email,
  onTrash,
  onPlan,
  onSetting,
  onLogout,
  onClose: _onClose,
  className,
  ...rest
}: ProfileModalProps) {
  const ref = useRef<HTMLDivElement>(null)

  const items: SidebarMenuItem[] = [
    { icon: <TrashIcon width={28} height={28} />, label: '휴지통', onClick: onTrash },
    { label: '플랜 및 결제', onClick: onPlan },
    { icon: <SettingIcon width={28} height={28} />, label: '설정', onClick: onSetting },
    { label: '로그아웃', onClick: onLogout },
  ]

  return (
    <div ref={ref} className={className} {...rest}>
      <SidebarMenu email={email} items={items} />
    </div>
  )
}
