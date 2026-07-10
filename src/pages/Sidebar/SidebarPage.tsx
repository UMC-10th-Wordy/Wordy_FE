import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sidebar } from '@/components/sidebar'
import { ProfileModal } from '@/components/sidebar/ProfileModal/ProfileModal'
import { SettingModal } from '@/components/sidebar/SettingModal/SettingModal'
import HomeIcon from '@/assets/icons/home.svg?react'
import BellDotIcon from '@/assets/icons/bell-dot.svg?react'
import CalendarIcon from '@/assets/icons/calendar.svg?react'
import DocumentIcon from '@/assets/icons/document.svg?react'
import DashboardIcon from '@/assets/icons/dashboard.svg?react'

type ModalState = null | 'profile-menu' | 'setting'

export function SidebarPage() {
  const navigate = useNavigate()
  const [modal, setModal] = useState<ModalState>(null)
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    '새 업무 알림': true,
    '업무 완료 알림': false,
    '코멘트 알림': true,
  })

  const pages = [
    { page: '홈' as const, icon: <HomeIcon className="size-6" />, category: 'general' as const },
    {
      page: '알림함' as const,
      icon: <BellDotIcon className="size-6" />,
      badge: 99,
      category: 'general' as const,
    },
    {
      page: '오늘의업무' as const,
      icon: <CalendarIcon className="size-6" />,
      category: 'feature' as const,
    },
    {
      page: '일지모아보기' as const,
      icon: <DocumentIcon className="size-6" />,
      category: 'feature' as const,
    },
    {
      page: '성과대시보드' as const,
      icon: <DashboardIcon className="size-6" />,
      category: 'feature' as const,
    },
  ]

  return (
    <>
      <Sidebar
        page="홈"
        status="open"
        pages={pages}
        workspaceName="내 워크스페이스"
        userName="홍길동"
        userPlan="Free"
        onProfileClick={() => setModal((prev) => (prev === 'profile-menu' ? null : 'profile-menu'))}
        profileMenu={
          modal === 'profile-menu' ? (
            <ProfileModal
              email="example@email.com"
              onTrash={() => {
                setModal(null)
                navigate('/trash')
              }}
              onPlan={() => {
                setModal(null)
                navigate('/plan')
              }}
              onSetting={() => setModal('setting')}
              onClose={() => setModal(null)}
            />
          ) : undefined
        }
      />

      {modal === 'setting' && (
        <SettingModal
          profileName="홍길동"
          profileEmail="example@email.com"
          profileJob=""
          profileCareer=""
          notificationSettings={notifications}
          onChangeNotification={(key, value) =>
            setNotifications((prev) => ({ ...prev, [key]: value }))
          }
          onClose={() => setModal(null)}
        />
      )}
    </>
  )
}
