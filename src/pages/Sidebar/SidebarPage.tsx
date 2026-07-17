import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Sidebar,
  ProfileModal,
  SettingModal,
  NotificationModal,
  WorkspaceModal,
} from '@/components/sidebar'
import type { SidebarPage, NotificationItemProps } from '@/components/sidebar'
import TodoListPage from '@/pages/TodoListPage/TodoListPage'
import { HomePage } from '@/pages/Home/HomePage'
import { DiaryListPage } from '@/pages/DiaryListPage'
import { DiaryDetailPage } from '@/pages/DiaryDetailPage'
import HomeIcon from '@/assets/icons/home.svg?react'
import BellDotIcon from '@/assets/icons/bell-dot.svg?react'
import CalendarIcon from '@/assets/icons/calendar.svg?react'
import DocumentIcon from '@/assets/icons/document.svg?react'
import DashboardIcon from '@/assets/icons/dashboard.svg?react'
import { WeeklyDashboard } from '@/components/dashboard/WeeklyDashboard'

type ModalState = null | 'profile-menu' | 'setting' | 'notification' | 'workspace'

const PAGE_ROUTES: Record<string, string> = {
  홈: '/',
  '오늘의 업무': '/today',
  '일지 모아보기': '/records',
  '성과 대시보드': '/dashboard',
}
type SidebarPageName = '홈' | '알림함' | '오늘의 업무' | '일지 모아보기' | '성과 대시보드'

const PAGE_BY_PATH: Record<string, SidebarPageName> = {
  '/': '홈',
  '/today': '오늘의 업무',
  '/records': '일지 모아보기',
  '/dashboard': '성과 대시보드',
}

const getPageByPath = (pathname: string): SidebarPageName => {
  if (pathname.startsWith('/records/')) {
    return '일지 모아보기'
  }

  return PAGE_BY_PATH[pathname] ?? '홈'
}

export function SidebarPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [modal, setModal] = useState<ModalState>(null)
  const [sidebarStatus, setSidebarStatus] = useState<'open' | 'closed'>(() => {
    const stored = localStorage.getItem('sidebarStatus')
    return stored === 'open' || stored === 'closed' ? stored : 'open'
  })
  const [currentPage, setCurrentPage] = useState<SidebarPage>(() =>
    getPageByPath(location.pathname),
  )
  const [workspaces, setWorkspaces] = useState([{ id: '1', name: 'Alex Kim의 워크스페이스' }])
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState('1')
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    '새 업무 알림': true,
    '업무 완료 알림': false,
    '코멘트 알림': true,
  })

  const isDiaryListPage = location.pathname === '/records'
  const isDiaryDetailPage = location.pathname.startsWith('/records/')

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
    <div className="flex h-screen w-full items-stretch">
      <Sidebar
        page={currentPage}
        status={sidebarStatus}
        onChangeStatus={(status) => {
          setSidebarStatus(status)
          localStorage.setItem('sidebarStatus', status)
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

      {currentPage === '홈' && <HomePage className="flex-1" userName="홍길동" />}
      {currentPage === '오늘의 업무' && <TodoListPage />}
      {currentPage === '성과 대시보드' && <WeeklyDashboard />}
      {currentPage === '일지 모아보기' && isDiaryListPage && <DiaryListPage />}
      {currentPage === '일지 모아보기' && isDiaryDetailPage && <DiaryDetailPage />}

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
