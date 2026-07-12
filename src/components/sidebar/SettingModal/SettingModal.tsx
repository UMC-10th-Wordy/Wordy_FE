import { SettingPanel } from '../SettingPanel/SettingPanel'
import type { SettingPanelProps } from '../SettingPanel/SettingPanel'

export type SettingModalProps = SettingPanelProps

export function SettingModal({ onClose, className, ...rest }: SettingModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-(--color-bg-overlay) backdrop-blur-[4px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.()
      }}
    >
      <SettingPanel onClose={onClose} className={className} {...rest} />
    </div>
  )
}
