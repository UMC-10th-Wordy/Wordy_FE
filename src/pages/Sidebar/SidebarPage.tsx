import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sidebar } from '@/components/sidebar'
import { ProfileModal } from '@/components/sidebar/ProfileModal/ProfileModal'
import { SettingModal } from '@/components/sidebar/SettingModal/SettingModal'
import { NotificationModal } from '@/components/sidebar/NotificationModal/NotificationModal'
import { WorkspaceModal } from '@/components/sidebar/WorkspaceModal/WorkspaceModal'
import type { NotificationItemProps } from '@/components/sidebar/NotificationItem/NotificationItem'
import TodoListPage from '@/pages/TodoListPage/TodoListPage'
import { DiaryListPage } from '@/pages/DiaryListPage'
import HomeIcon from '@/assets/icons/home.svg?react'
import BellDotIcon from '@/assets/icons/bell-dot.svg?react'
import CalendarIcon from '@/assets/icons/calendar.svg?react'
import DocumentIcon from '@/assets/icons/document.svg?react'
import DashboardIcon from '@/assets/icons/dashboard.svg?react'

type ModalState = null | 'profile-menu' | 'setting' | 'notification' | 'workspace'

const PAGE_ROUTES: Record<string, string> = {
  홈: '/',
  '오늘의 업무': '/today',
  '일지 모아보기': '/records',
  '성과 대시보드': '/dashboard',
}

export function SidebarPage() {
  const navigate = useNavigate()
  const [modal, setModal] = useState<ModalState>(null)
  const [sidebarStatus, setSidebarStatus] = useState<'open' | 'closed'>('open')
  const [currentPage, setCurrentPage] = useState<
    '홈' | '알림함' | '오늘의 업무' | '일지 모아보기' | '성과 대시보드'
  >('홈')
  const [workspaces, setWorkspaces] = useState([{ id: '1', name: 'Alex Kim의 워크스페이스' }])
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState('1')
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    '새 업무 알림': true,
    '업무 완료 알림': false,
    '코멘트 알림': true,
  })

  const notificationItems: NotificationItemProps[] = [
    {
      title: '7월의 성과 리포트를 발행해 주세요 👀',
      body: '일주일동안 업무 일지를 성실히 작성하셨네요!\n[성과 대시보드]에서 월간 리포트를 발행할 수 있어요.',
    },
    {
      title: '7월 2주차의 성과 리포트를 발행해 주세요 👀',
      body: '일주일 동안 업무 일지를 성실히 작성하셨네요!\n[성과 대시보드]에서 주간 리포트를 발행할 수 있어요.',
    },
    {
      title: '6월의 성과 리포트 발행 완료! 🎉',
      body: '회원님의 월간 성과 리포트가 발행되었어요.\n[성과 대시보드]에서 확인해 주세요!',
    },
    {
      title: '6월 3주차의 성과 리포트 발행 완료! 🎉',
      body: '회원님의 주간 성과 리포트가 발행되었어요.\n[성과 대시보드]에서 확인해 주세요!',
    },
    {
      title: '6월 3주차의 성과 리포트 발행 완료! 🎉',
      body: '회원님의 주간 성과 리포트가 발행되었어요.\n[성과 대시보드]에서 확인해 주세요!',
    },
  ]

  const pages = [
    { page: '홈' as const, icon: <HomeIcon className="size-6" />, category: 'general' as const },
    {
      page: '알림함' as const,
      icon: <BellDotIcon className="size-6" />,
      badge: 99,
      category: 'general' as const,
    },
    {
      page: '오늘의 업무' as const,
      icon: <CalendarIcon className="size-6" />,
      category: 'feature' as const,
    },
    {
      page: '일지 모아보기' as const,
      icon: <DocumentIcon className="size-6" />,
      category: 'feature' as const,
    },
    {
      page: '성과 대시보드' as const,
      icon: <DashboardIcon className="size-6" />,
      category: 'feature' as const,
    },
  ]

  return (
    <div className="flex h-screen w-full items-start bg-(--color-bg-default)">
      <Sidebar
        page={currentPage}
        status={sidebarStatus}
        onChangeStatus={(status) => {
          setSidebarStatus(status)
          if (status === 'closed') setModal(null)
        }}
        onChangePage={(page) => {
          setCurrentPage(page)
          const route = PAGE_ROUTES[page]
          if (route) navigate(route)
        }}
        pages={pages}
        workspaceName={workspaces.find((w) => w.id === selectedWorkspaceId)?.name ?? ''}
        userName="홍길동"
        userPlan="무료 요금제"
        onWorkspaceClick={() => setModal((prev) => (prev === 'workspace' ? null : 'workspace'))}
        onNotificationClick={() =>
          setModal((prev) => (prev === 'notification' ? null : 'notification'))
        }
        onProfileClick={() => setModal((prev) => (prev === 'profile-menu' ? null : 'profile-menu'))}
        workspaceMenu={
          modal === 'workspace' ? (
            <WorkspaceModal
              workspaces={workspaces}
              selectedId={selectedWorkspaceId}
              onAdd={(name) => setWorkspaces((prev) => [...prev, { id: String(Date.now()), name }])}
              onEdit={(id, name) =>
                setWorkspaces((prev) => prev.map((w) => (w.id === id ? { ...w, name } : w)))
              }
              onDelete={(id) => {
                setWorkspaces((prev) => {
                  const next = prev.filter((w) => w.id !== id)
                  if (selectedWorkspaceId === id) {
                    setSelectedWorkspaceId(next[0]?.id ?? '')
                  }
                  return next
                })
              }}
              onSelectWorkspace={(id) => {
                setSelectedWorkspaceId(id)
                setModal(null)
              }}
              onClose={() => setModal(null)}
            />
          ) : undefined
        }
        notificationMenu={
          modal === 'notification' ? (
            <NotificationModal
              notifications={notificationItems.map((item) => ({
                ...item,
                onClick: () => {
                  setModal(null)
                  navigate(PAGE_ROUTES['성과 대시보드'])
                },
              }))}
              onClose={() => setModal(null)}
            />
          ) : undefined
        }
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

      {currentPage === '오늘의 업무' && <TodoListPage />}
      {currentPage === '일지 모아보기' && <DiaryListPage />}

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
