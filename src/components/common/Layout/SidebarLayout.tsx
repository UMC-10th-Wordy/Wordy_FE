import { useState, type CSSProperties } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import {
  Sidebar,
  ProfileModal,
  SettingModal,
  NotificationModal,
  WorkspaceModal,
} from '@/components/sidebar'
import type { NotificationSettings } from '@/components/sidebar/SettingPanel/SettingPanel'
import { INITIAL_WORKSPACES_MOCK } from '@/mocks/workspace/workspaceMock'
import { NOTIFICATION_ITEMS_MOCK } from '@/mocks/notification/notificationMock'
import {
  CAREER_TO_YEARS_OF_SERVICE,
  JOB_TO_JOB_ROLE,
  JOB_ROLE_TO_JOB,
  YEARS_OF_SERVICE_TO_CAREER,
} from '@/constants/onboarding'
import type { CareerOption, JobOption } from '@/constants/onboarding'
import { updateProfile, postProfileImage } from '@/api/user/user.api'
import { useGetProfile, userQueryKeys } from '@/api/user/user.query'
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
type SidebarPageName = '홈' | '알림함' | '오늘의 업무' | '일지 모아보기' | '성과 대시보드'

const PAGE_BY_PATH: Record<string, SidebarPageName> = {
  '/': '홈',
  '/today': '오늘의 업무',
  '/records': '일지 모아보기',
  '/dashboard': '성과 대시보드',
}

const FALLBACK_PLAN = '무료 요금제'

const getPageByPath = (pathname: string): SidebarPageName => {
  if (pathname.startsWith('/records/')) {
    return '일지 모아보기'
  }

  return PAGE_BY_PATH[pathname] ?? '홈'
}

export function SidebarLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [modal, setModal] = useState<ModalState>(null)
  const [sidebarStatus, setSidebarStatus] = useState<'open' | 'closed'>(() => {
    const stored = localStorage.getItem('sidebarStatus')
    return stored === 'open' || stored === 'closed' ? stored : 'open'
  })
  const currentPage = getPageByPath(location.pathname)
  const queryClient = useQueryClient()
  const [workspaces, setWorkspaces] = useState(INITIAL_WORKSPACES_MOCK)
  const { data: profileData } = useGetProfile()

  const job: JobOption | '' = profileData ? JOB_ROLE_TO_JOB[profileData.jobRole] : ''
  const career: CareerOption | '' = profileData
    ? YEARS_OF_SERVICE_TO_CAREER[profileData.yearsOfService]
    : ''
  const profile = {
    name: profileData?.userName ?? '',
    email: profileData?.email ?? '',
    plan: FALLBACK_PLAN,
    job,
    career,
    profileImgUrl: profileData?.profileImgUrl ?? '',
  }
  const resolvedWorkspaces = workspaces.map((w) =>
    w.id === '1' && !w.name && profileData
      ? { ...w, name: `${profileData.userName}의 워크스페이스` }
      : w,
  )

  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState('1')
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailMarketing: false,
    inboxMarketing: false,
    inboxPerformanceReady: false,
    inboxPerformanceNudge: false,
  })

  const notificationItems = NOTIFICATION_ITEMS_MOCK

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
    <div
      className="flex h-screen w-full items-stretch"
      style={{ '--sidebar-width': sidebarStatus === 'open' ? '260px' : '72px' } as CSSProperties}
    >
      <Sidebar
        page={currentPage}
        status={sidebarStatus}
        onChangeStatus={(status) => {
          setSidebarStatus(status)
          localStorage.setItem('sidebarStatus', status)
          if (status === 'closed') setModal(null)
        }}
        onChangePage={(page) => {
          const route = PAGE_ROUTES[page]
          if (route) navigate(route)
        }}
        pages={pages}
        workspaceName={resolvedWorkspaces.find((w) => w.id === selectedWorkspaceId)?.name ?? ''}
        userName={profile.name}
        userPlan={profile.plan}
        avatarSrc={profile.profileImgUrl}
        onLogoClick={() => navigate('/')}
        onWorkspaceClick={() => setModal((prev) => (prev === 'workspace' ? null : 'workspace'))}
        onNotificationClick={() =>
          setModal((prev) => (prev === 'notification' ? null : 'notification'))
        }
        onProfileClick={() => setModal((prev) => (prev === 'profile-menu' ? null : 'profile-menu'))}
        workspaceMenu={
          modal === 'workspace' ? (
            <WorkspaceModal
              workspaces={resolvedWorkspaces}
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
              email={profile.email}
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

      <Outlet />

      {modal === 'setting' && (
        <SettingModal
          profileName={profile.name}
          profileEmail={profile.email}
          profileJob={profile.job}
          profileCareer={profile.career}
          profileAvatarSrc={profile.profileImgUrl}
          notificationSettings={notifications}
          onChangeNotification={(key, value) =>
            setNotifications((prev) => ({ ...prev, [key]: value }))
          }
          onSaveProfile={async ({ name, job, career, avatarFile }) => {
            if (!job || !career) {
              alert('직무와 연차를 선택해 주세요.')
              return
            }

            let imageUploaded = false
            try {
              // 프로필이 이미 등록된 상태라 이미지 업로드만으로 즉시 반영됨 (별도 profileImgUrl 전송 불필요)
              if (avatarFile) {
                await postProfileImage(avatarFile)
                imageUploaded = true
              }

              await updateProfile({
                userName: name,
                yearsOfService: CAREER_TO_YEARS_OF_SERVICE[career],
                jobRole: JOB_TO_JOB_ROLE[job],
              })

              await queryClient.invalidateQueries({ queryKey: userQueryKeys.profile() })
              setModal(null)
            } catch {
              alert(
                imageUploaded
                  ? '프로필 사진은 저장됐지만 나머지 정보 저장에 실패했어요. 다시 시도해 주세요.'
                  : '프로필 수정에 실패했어요. 다시 시도해 주세요.',
              )
            }
          }}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
