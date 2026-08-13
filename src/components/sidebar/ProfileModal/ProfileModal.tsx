import { useRef } from 'react'
import type { HTMLAttributes, RefObject } from 'react'
import { SidebarMenu } from '../SidebarMenu/SidebarMenu'
import type { SidebarMenuItem } from '../SidebarMenu/SidebarMenu'
import { useOutsideClick } from '@/hooks/useOutsideClick'
import SettingIcon from '@/assets/icons/setting.svg?react'
import CardIcon from '@/assets/icons/card.svg?react'
import LogoutIcon from '@/assets/icons/logout.svg?react'

export interface ProfileModalProps extends HTMLAttributes<HTMLDivElement> {
  email: string
  onPlan?: () => void
  onSetting?: () => void
  onLogout?: () => void
  onClose?: () => void
  triggerRef?: RefObject<HTMLElement | null>
}

export function ProfileModal({
  email,
  onPlan,
  onSetting,
  onLogout,
  onClose,
  triggerRef,
  className,
  ...rest
}: ProfileModalProps) {
  const ref = useRef<HTMLDivElement>(null)
  useOutsideClick(ref, () => onClose?.(), true, triggerRef)

  const items: SidebarMenuItem[] = [
    { icon: <CardIcon width={28} height={28} />, label: '플랜 및 결제', onClick: onPlan },
    { icon: <SettingIcon width={28} height={28} />, label: '설정', onClick: onSetting },
    { icon: <LogoutIcon width={28} height={28} />, label: '로그아웃', onClick: onLogout },
  ]

  return (
    <div ref={ref} className={className} {...rest}>
      <SidebarMenu email={email} items={items} />
    </div>
  )
}
