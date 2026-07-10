import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { ProfileModal } from '@/components/sidebar/ProfileModal/ProfileModal'
import { SettingModal } from '@/components/sidebar/SettingModal/SettingModal'
import HomeIcon from '@/assets/icons/home.svg?react'
import BellDotIcon from '@/assets/icons/bell-dot.svg?react'
import CalendarIcon from '@/assets/icons/calendar.svg?react'
import DocumentIcon from '@/assets/icons/document.svg?react'
import DashboardIcon from '@/assets/icons/dashboard.svg?react'

type ModalState = null | 'profile-menu' | 'setting'

function App() {
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
    <div className="relative flex min-h-screen bg-(--color-bg-default)">
      <Sidebar
        page="홈"
        status="open"
        pages={pages}
        workspaceName="내 워크스페이스"
        userName="홍길동"
        userPlan="Free"
        onProfileClick={() => setModal('profile-menu')}
      />

      {modal === 'profile-menu' && (
        <ProfileModal
          email="example@email.com"
          onSetting={() => setModal('setting')}
          onClose={() => setModal(null)}
          className="absolute left-4 bottom-20 z-40"
        />
      )}

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
    </div>
  )
}

export default App
