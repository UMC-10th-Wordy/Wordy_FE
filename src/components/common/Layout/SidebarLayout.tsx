import { useRef, useState, type CSSProperties } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import {
  Sidebar,
  ProfileModal,
  SettingModal,
  NotificationModal,
  WorkspaceModal,
} from '@/components/sidebar'
import { ConfirmDialog } from '@/components/common/ConfirmDialog/ConfirmDialog'
import type { NotificationSettings } from '@/components/sidebar/SettingPanel/SettingPanel'
import {
  CAREER_TO_YEARS_OF_SERVICE,
  JOB_TO_JOB_ROLE,
  JOB_ROLE_TO_JOB,
  YEARS_OF_SERVICE_TO_CAREER,
} from '@/constants/onboarding'
import type { CareerOption, JobOption } from '@/constants/onboarding'
import { updateProfile, postProfileImage, userQueryKeys } from '@/api/user/user'
import { homeQueryKeys } from '@/api/home/home'
import { useGetProfile } from '@/hooks/useUserQueries'
import { useChangePassword, useLogout, useWithdraw } from '@/hooks/useAuthQueries'
import {
  useGetNotificationSettings,
  useGetNotifications,
  useReadNotification,
  useUpdateNotificationSetting,
} from '@/hooks/useNotificationQueries'
import {
  useActiveWorkspaceId,
  useCreateWorkspace,
  useDeleteWorkspace,
  useGetWorkspaces,
  useUpdateWorkspace,
} from '@/hooks/useWorkspaceQueries'
import type { NotificationSettingKey } from '@/types/notification'
import { ApiError, clearAuthTokens } from '@/lib/httpClient'
import { useWorkspaceStore } from '@/store/workspaceStore'
import HomeIcon from '@/assets/icons/home.svg?react'
import BellIcon from '@/assets/icons/bell.svg?react'
import BellDotIcon from '@/assets/icons/bell-dot.svg?react'
import CalendarIcon from '@/assets/icons/calendar.svg?react'
import DocumentIcon from '@/assets/icons/document.svg?react'
import DashboardIcon from '@/assets/icons/dashboard.svg?react'

type ModalState =
  null | 'profile-menu' | 'setting' | 'notification' | 'workspace' | 'logout-confirm'

const PAGE_ROUTES: Record<string, string> = {
  홈: '/',
  '오늘의 업무': '/today',
  '일지 히스토리': '/records',
  '성과 리포트': '/dashboard',
}
type SidebarPageName = '홈' | '알림함' | '오늘의 업무' | '일지 히스토리' | '성과 리포트'

const PAGE_BY_PATH: Record<string, SidebarPageName> = {
  '/': '홈',
  '/today': '오늘의 업무',
  '/records': '일지 히스토리',
  '/dashboard': '성과 리포트',
}

const FALLBACK_PLAN = '무료 요금제'

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  emailMarketing: false,
  inboxMarketing: false,
  inboxPerformanceReady: false,
  inboxPerformanceNudge: false,
}

const NOTIFICATION_SETTING_KEY_MAP: Record<keyof NotificationSettings, NotificationSettingKey> = {
  emailMarketing: 'EMAIL_MARKETING',
  inboxMarketing: 'INBOX_MARKETING_PROMOTION',
  inboxPerformanceReady: 'DASHBOARD_COMPLETED',
  inboxPerformanceNudge: 'DASHBOARD_INDUCE',
}

const getPageByPath = (pathname: string): SidebarPageName => {
  if (pathname.startsWith('/records/')) {
    return '일지 히스토리'
  }

  return PAGE_BY_PATH[pathname] ?? '홈'
}

export function SidebarLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [modal, setModal] = useState<ModalState>(null)
  const workspaceTriggerRef = useRef<HTMLButtonElement>(null)
  const notificationTriggerRef = useRef<HTMLButtonElement>(null)
  const profileTriggerRef = useRef<HTMLButtonElement>(null)
  const [sidebarStatus, setSidebarStatus] = useState<'open' | 'closed'>(() => {
    const stored = localStorage.getItem('sidebarStatus')
    return stored === 'open' || stored === 'closed' ? stored : 'open'
  })
  const currentPage = getPageByPath(location.pathname)
  const queryClient = useQueryClient()
  const { data: workspacesData } = useGetWorkspaces()
  const { mutate: createWorkspace } = useCreateWorkspace()
  const { mutate: updateWorkspace } = useUpdateWorkspace()
  const { mutate: deleteWorkspace } = useDeleteWorkspace()
  const { data: profileData } = useGetProfile()
  const { mutate: logout } = useLogout()
  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword()
  const { mutate: withdraw, isPending: isWithdrawing } = useWithdraw()

  const handleLogout = () => {
    setModal(null)
    logout(undefined, {
      onSettled: () => {
        clearAuthTokens()
        queryClient.clear()
        setSelectedWorkspaceId(null)
        navigate('/login')
      },
    })
  }

  const handleChangePassword = (data: { currentPassword: string; newPassword: string }) => {
    if (isChangingPassword) return
    changePassword(data, {
      onSuccess: () => {
        alert('비밀번호가 변경되었어요. 다시 로그인해 주세요.')
        clearAuthTokens()
        queryClient.clear()
        setSelectedWorkspaceId(null)
        navigate('/login')
      },
      onError: (error) => {
        alert(
          error instanceof ApiError
            ? error.message
            : '비밀번호 변경에 실패했어요. 다시 시도해 주세요.',
        )
      },
    })
  }

  const handleWithdraw = () => {
    if (isWithdrawing) return
    setModal(null)
    withdraw(undefined, {
      onSuccess: () => {
        clearAuthTokens()
        queryClient.clear()
        setSelectedWorkspaceId(null)
        navigate('/landing')
      },
      onError: (error) => {
        alert(error instanceof ApiError ? error.message : '탈퇴에 실패했어요. 다시 시도해 주세요.')
      },
    })
  }

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
  const resolvedWorkspaces = (workspacesData ?? []).map((w) => ({
    id: w.workspaceId,
    name: w.name,
  }))

  const { selectedWorkspaceId, setSelectedWorkspaceId } = useWorkspaceStore()
  const activeWorkspaceId = useActiveWorkspaceId()
  const { data: notificationsData } = useGetNotifications()
  const { mutate: readNotification } = useReadNotification()
  const { data: notificationSettingsData } = useGetNotificationSettings()
  const { mutate: updateNotificationSetting } = useUpdateNotificationSetting()

  const notificationItems = notificationsData?.items ?? []
  const unreadNotificationCount = notificationsData?.totalCount ?? 0
  const notificationSettings: NotificationSettings = notificationSettingsData
    ? {
        emailMarketing: notificationSettingsData.emailMarketing,
        inboxMarketing: notificationSettingsData.inboxMarketingPromotion,
        inboxPerformanceReady: notificationSettingsData.dashboardCompleted,
        inboxPerformanceNudge: notificationSettingsData.dashboardInduce,
      }
    : DEFAULT_NOTIFICATION_SETTINGS

  const pages = [
    { page: '홈' as const, icon: <HomeIcon className="size-6" />, category: 'general' as const },
    {
      page: '알림함' as const,
      icon:
        unreadNotificationCount > 0 ? (
          <BellDotIcon className="size-6" />
        ) : (
          <BellIcon className="size-6" />
        ),
      badge: unreadNotificationCount,
      category: 'general' as const,
    },
    {
      page: '오늘의 업무' as const,
      icon: <CalendarIcon className="size-6" />,
      category: 'feature' as const,
    },
    {
      page: '일지 히스토리' as const,
      icon: <DocumentIcon className="size-6" />,
      category: 'feature' as const,
    },
    {
      page: '성과 리포트' as const,
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
        workspaceName={resolvedWorkspaces.find((w) => w.id === activeWorkspaceId)?.name ?? ''}
        userName={profile.name}
        userPlan={profile.plan}
        avatarSrc={profile.profileImgUrl}
        onLogoClick={() => navigate('/')}
        onWorkspaceClick={() => setModal((prev) => (prev === 'workspace' ? null : 'workspace'))}
        onNotificationClick={() =>
          setModal((prev) => (prev === 'notification' ? null : 'notification'))
        }
        onProfileClick={() => setModal((prev) => (prev === 'profile-menu' ? null : 'profile-menu'))}
        workspaceTriggerRef={workspaceTriggerRef}
        notificationTriggerRef={notificationTriggerRef}
        profileTriggerRef={profileTriggerRef}
        workspaceMenu={
          modal === 'workspace' ? (
            <WorkspaceModal
              triggerRef={workspaceTriggerRef}
              workspaces={resolvedWorkspaces}
              selectedId={activeWorkspaceId}
              onAdd={(name) => {
                createWorkspace(
                  { name },
                  {
                    onSuccess: (data) => {
                      setSelectedWorkspaceId(data.workspaceId)
                    },
                    onError: (error) => {
                      alert(
                        error instanceof ApiError
                          ? error.message
                          : '워크스페이스 생성에 실패했어요. 다시 시도해 주세요.',
                      )
                    },
                  },
                )
              }}
              onEdit={(id, name) => {
                updateWorkspace(
                  { workspaceId: id, name },
                  {
                    onError: (error) => {
                      alert(
                        error instanceof ApiError
                          ? error.message
                          : '워크스페이스 이름 수정에 실패했어요. 다시 시도해 주세요.',
                      )
                    },
                  },
                )
              }}
              onDelete={(id) => {
                deleteWorkspace(id, {
                  onSuccess: () => {
                    if (selectedWorkspaceId === id) {
                      setSelectedWorkspaceId(null)
                    }
                  },
                  onError: (error) => {
                    alert(
                      error instanceof ApiError
                        ? error.message
                        : '워크스페이스 삭제에 실패했어요. 다시 시도해 주세요.',
                    )
                  },
                })
              }}
              onSelectWorkspace={(id) => {
                const isWorkspaceChanged = id !== activeWorkspaceId
                setSelectedWorkspaceId(id)
                setModal(null)
                if (isWorkspaceChanged && location.pathname.startsWith('/records/')) {
                  navigate('/records')
                }
              }}
              onClose={() => setModal(null)}
            />
          ) : undefined
        }
        notificationMenu={
          modal === 'notification' ? (
            <NotificationModal
              triggerRef={notificationTriggerRef}
              isEmpty={notificationItems.length === 0}
              notifications={notificationItems.map((item) => ({
                title: item.title,
                body: item.content,
                onClick: () => {
                  setModal(null)
                  readNotification(item.notificationId)
                  navigate(PAGE_ROUTES['성과 리포트'])
                },
              }))}
              onClose={() => setModal(null)}
            />
          ) : undefined
        }
        profileMenu={
          modal === 'profile-menu' ? (
            <ProfileModal
              triggerRef={profileTriggerRef}
              email={profile.email}
              onPlan={() => {
                setModal(null)
                navigate('/plan')
              }}
              onSetting={() => setModal('setting')}
              onLogout={() => setModal('logout-confirm')}
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
          onChangePassword={handleChangePassword}
          isChangingPassword={isChangingPassword}
          onWithdraw={handleWithdraw}
          isWithdrawing={isWithdrawing}
          notificationSettings={notificationSettings}
          onChangeNotification={(key, value) =>
            updateNotificationSetting({
              settingKey: NOTIFICATION_SETTING_KEY_MAP[key],
              isEnabled: value,
            })
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
              await queryClient.invalidateQueries({
                queryKey: homeQueryKeys.all(activeWorkspaceId),
              })
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

      {modal === 'logout-confirm' && (
        <ConfirmDialog
          message="현재 계정에서 로그아웃 할까요?"
          confirmLabel="로그아웃 하기"
          cancelLabel="취소하기"
          onConfirm={handleLogout}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  )
}
