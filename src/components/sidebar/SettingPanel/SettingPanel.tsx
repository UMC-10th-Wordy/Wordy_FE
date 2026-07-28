import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { HTMLAttributes } from 'react'
import { SidebarTap } from '../SidebarTap/SidebarTap'
import { Input1 } from '@/components/common/Input/Input1'
import { Toggle } from '@/components/common/Toggle/Toggle'
import { TextButton } from '@/components/common/Button/TextButton'
import { IconButton } from '@/components/common/Button/IconButton'
import { ConfirmDialog } from '@/components/common/ConfirmDialog/ConfirmDialog'
import { JobDropdown } from '../JobDropdown/JobDropdown'
import { CareerDropdown } from '../CareerDropdown/CareerDropdown'
import { SettingAccordion } from '../SettingAccordion/SettingAccordion'
import XMarkIcon from '@/assets/icons/x-mark.svg?react'
import CameraIcon from '@/assets/icons/camera.svg?react'
import ArrowLeftIcon from '@/assets/icons/Direction=left.svg?react'

export type SettingTab = 'profile' | 'notification'
type InnerView = 'main' | 'password'

export interface NotificationSettings {
  emailMarketing: boolean
  inboxMarketing: boolean
  inboxPerformanceReady: boolean
  inboxPerformanceNudge: boolean
}

export interface SettingPanelProps extends HTMLAttributes<HTMLDivElement> {
  initialTab?: SettingTab
  // 프로필
  profileName?: string
  profileEmail?: string
  profileJob?: string
  profileCareer?: string
  onSaveProfile?: (data: { name: string; job: string; career: string }) => void
  onChangePassword?: (data: { currentPassword: string; newPassword: string }) => void
  // 알림
  notificationSettings?: NotificationSettings
  onChangeNotification?: (key: keyof NotificationSettings, value: boolean) => void
  onClose?: () => void
}

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  emailMarketing: false,
  inboxMarketing: false,
  inboxPerformanceReady: false,
  inboxPerformanceNudge: false,
}

export function SettingPanel({
  initialTab = 'profile',
  profileName = '',
  profileEmail = '',
  profileJob = '',
  profileCareer = '',
  onSaveProfile,
  onChangePassword,
  notificationSettings = DEFAULT_NOTIFICATION_SETTINGS,
  onChangeNotification,
  onClose,
  className,
  ...rest
}: SettingPanelProps) {
  const [currentTab, setCurrentTab] = useState<SettingTab>(initialTab)
  const [innerView, setInnerView] = useState<InnerView>('main')
  const [name, setName] = useState(profileName)
  const [job, setJob] = useState(profileJob)
  const [career, setCareer] = useState(profileCareer)
  const [openDropdown, setOpenDropdown] = useState<'job' | 'career' | null>(null)
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false)
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const jobAnchorRef = useRef<HTMLDivElement>(null)
  const careerAnchorRef = useRef<HTMLDivElement>(null)
  const [jobRect, setJobRect] = useState<DOMRect | null>(null)
  const [careerRect, setCareerRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    if (openDropdown === 'job' && jobAnchorRef.current) {
      setJobRect(jobAnchorRef.current.getBoundingClientRect())
    }
    if (openDropdown === 'career' && careerAnchorRef.current) {
      setCareerRect(careerAnchorRef.current.getBoundingClientRect())
    }
  }, [openDropdown])

  useEffect(() => {
    if (!openDropdown) return
    const handleMouseDown = (e: MouseEvent) => {
      const jobAnchor = jobAnchorRef.current
      const careerAnchor = careerAnchorRef.current
      if (
        (jobAnchor && jobAnchor.contains(e.target as Node)) ||
        (careerAnchor && careerAnchor.contains(e.target as Node))
      )
        return
      setOpenDropdown(null)
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [openDropdown])

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setAvatarSrc(url)
  }

  const profileChanged =
    name !== profileName || job !== profileJob || career !== profileCareer || avatarSrc !== null

  const passwordMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword
  const passwordReady =
    currentPassword.length > 0 &&
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    !passwordMismatch

  const handleSave = () => {
    onSaveProfile?.({ name, job, career })
  }

  return (
    <>
      <div
        className={[
          'bg-(--color-bg-default) rounded-(--scale-12) shadow-[0px_1px_7.5px_rgba(0,0,0,0.1)]',
          'flex items-center h-150 w-215 max-h-full max-w-full',
          className,
        ].join(' ')}
        {...rest}
      >
        {/* 좌측 탭 */}
        <div className="border-r border-(--color-border-brand-subtle) flex flex-col gap-1 h-full items-start py-5 shrink-0 w-40">
          <SidebarTap
            label="프로필"
            state={currentTab === 'profile' ? 'focused' : 'default'}
            onClick={() => setCurrentTab('profile')}
          />
          <SidebarTap
            label="알림"
            state={currentTab === 'notification' ? 'focused' : 'default'}
            onClick={() => setCurrentTab('notification')}
          />
        </div>

        {/* 우측 콘텐츠 */}
        <div className="flex flex-1 flex-col h-full isolate items-start justify-between min-w-0 min-h-0 p-5">
          {currentTab === 'profile' && innerView === 'password' ? (
            <>
              <div className="flex flex-col gap-6 items-start shrink-0 w-full">
                <div className="flex items-center justify-between shrink-0 w-full">
                  <div className="flex items-center gap-2">
                    <IconButton
                      variant="text_neutral"
                      size="small"
                      icon={<ArrowLeftIcon className="size-6" />}
                      onClick={() => setInnerView('main')}
                      aria-label="돌아가기"
                    />
                    <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-semibold text-(--color-text-secondary) whitespace-nowrap">
                      비밀번호 변경
                    </span>
                  </div>
                  <IconButton
                    variant="text_neutral"
                    size="medium"
                    icon={<XMarkIcon width={32} height={32} />}
                    onClick={onClose}
                    aria-label="닫기"
                  />
                </div>
                <div className="flex flex-col gap-6 w-full">
                  <Input1
                    label={
                      <>
                        현재 비밀번호 <span className="text-(--color-status-error)">*</span>
                      </>
                    }
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="사용하고 있는 비밀번호를 입력해 주세요"
                  />
                  <Input1
                    label={
                      <>
                        새로운 비밀번호 <span className="text-(--color-status-error)">*</span>
                      </>
                    }
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="변경할 비밀번호를 입력해 주세요"
                    hint="영문, 숫자, 특수문자를 모두 포함한 8자리 이상의 조합으로 만들어주세요"
                  />
                  <Input1
                    label={
                      <>
                        새로운 비밀번호 확인 <span className="text-(--color-status-error)">*</span>
                      </>
                    }
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="변경할 비밀번호를 한 번 더 입력해 주세요"
                    error={passwordMismatch ? '변경할 비밀번호가 일치하지 않아요' : undefined}
                  />
                </div>
              </div>
              <div className="flex justify-end shrink-0 w-full">
                <TextButton
                  variant="fill"
                  size="large"
                  disabled={!passwordReady}
                  onClick={() => onChangePassword?.({ currentPassword, newPassword })}
                >
                  비밀번호 변경하기
                </TextButton>
              </div>
            </>
          ) : currentTab === 'profile' ? (
            <>
              <div className="flex flex-col gap-6 items-start shrink-0 w-full">
                {/* 헤더 */}
                <div className="flex items-center justify-between shrink-0 w-full">
                  <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-semibold text-(--color-text-secondary) whitespace-nowrap">
                    프로필 설정
                  </span>
                  <IconButton
                    variant="text_neutral"
                    size="medium"
                    icon={<XMarkIcon width={32} height={32} />}
                    onClick={onClose}
                    aria-label="닫기"
                  />
                </div>

                {/* 폼 */}
                <div className="flex gap-5 items-start shrink-0 w-full">
                  {/* 아바타 */}
                  <div className="relative shrink-0">
                    <div className="size-29.5 rounded-(--scale-1000) border border-(--color-border-opacity) overflow-hidden bg-(--color-bg-secondary)">
                      {avatarSrc && (
                        <img src={avatarSrc} alt="프로필" className="size-full object-cover" />
                      )}
                    </div>
                    <button
                      type="button"
                      className="absolute bottom-0 right-0 size-9.5 rounded-full bg-(--color-icon-brand) border-2 border-(--color-border-inverse) flex items-center justify-center"
                      aria-label="프로필 사진 변경"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <CameraIcon width={24} height={24} className="text-white" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </div>

                  {/* 입력 필드 */}
                  <div className="flex flex-col gap-3 flex-1 min-w-0 isolate">
                    {/* 닉네임 */}
                    <div className="flex items-center gap-5">
                      <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-medium text-(--color-text-tertiary) text-right w-17 shrink-0">
                        닉네임
                      </span>
                      <div className="flex-1 bg-(--color-bg-brand-subtle) border-[0.5px] border-(--color-border-brand-subtle) rounded-lg px-5 py-3">
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-transparent outline-none [font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-default)"
                        />
                      </div>
                    </div>
                    {/* 이메일 */}
                    <div className="flex items-center gap-5 h-13.25">
                      <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-medium text-(--color-text-tertiary) text-right w-17 shrink-0">
                        이메일
                      </span>
                      <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-default)">
                        {profileEmail}
                      </span>
                    </div>
                    {/* 비밀번호 */}
                    <div className="flex items-center gap-5 h-13.25">
                      <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-medium text-(--color-text-tertiary) text-right w-17 shrink-0">
                        비밀번호
                      </span>
                      <TextButton
                        variant="stroke"
                        size="medium"
                        onClick={() => setInnerView('password')}
                      >
                        비밀번호 변경하기
                      </TextButton>
                    </div>
                    {/* 직무 */}
                    <div className="flex items-center gap-5">
                      <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-medium text-(--color-text-tertiary) text-right w-17 shrink-0">
                        직무
                      </span>
                      <div ref={jobAnchorRef} className="relative flex-1 min-w-0">
                        <SettingAccordion
                          label={job || '선택'}
                          className="w-full"
                          aria-expanded={openDropdown === 'job'}
                          onClick={() => setOpenDropdown((v) => (v === 'job' ? null : 'job'))}
                        />
                      </div>
                    </div>
                    {/* 재직 연차 */}
                    <div className="flex items-center gap-5">
                      <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-medium text-(--color-text-tertiary) text-right w-17 shrink-0">
                        재직 연차
                      </span>
                      <div ref={careerAnchorRef} className="relative flex-1 min-w-0">
                        <SettingAccordion
                          label={career || '선택'}
                          className="w-full"
                          aria-expanded={openDropdown === 'career'}
                          onClick={() => setOpenDropdown((v) => (v === 'career' ? null : 'career'))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 하단 버튼 */}
              <div className="flex items-center justify-between shrink-0 w-full">
                <TextButton
                  variant="text_only"
                  size="large"
                  onClick={() => setShowWithdrawConfirm(true)}
                >
                  워디 탈퇴하기
                </TextButton>
                <TextButton
                  variant="fill"
                  size="large"
                  onClick={handleSave}
                  disabled={!profileChanged}
                >
                  프로필 저장하기
                </TextButton>
              </div>
            </>
          ) : (
            <>
              {/* 알림 탭 */}
              <div className="flex flex-col gap-6 items-start shrink-0 w-full">
                <div className="flex items-center justify-between shrink-0 w-full">
                  <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-semibold text-(--color-text-secondary) whitespace-nowrap">
                    알림 설정
                  </span>
                  <IconButton
                    variant="text_neutral"
                    size="medium"
                    icon={<XMarkIcon width={32} height={32} />}
                    onClick={onClose}
                    aria-label="닫기"
                  />
                </div>

                <div className="flex flex-col gap-4 w-full">
                  {(
                    [
                      {
                        key: 'emailMarketing',
                        channel: '[이메일]',
                        label: '마케팅 및 프로모션 정보 수신',
                      },
                      {
                        key: 'inboxMarketing',
                        channel: '[알림함]',
                        label: '마케팅 및 프로모션 정보 알림',
                      },
                      {
                        key: 'inboxPerformanceReady',
                        channel: '[알림함]',
                        label: '성과 대시보드 생성 완료 알림',
                      },
                      {
                        key: 'inboxPerformanceNudge',
                        channel: '[알림함]',
                        label: '성과 대시보드 생성 유도 알림',
                      },
                    ] as const
                  ).map(({ key, channel, label }) => (
                    <div key={key} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="[font-size:var(--font-size-body-3)] leading-(--line-height-body) font-medium text-(--color-text-brand) shrink-0">
                          {channel}
                        </span>
                        <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-default)">
                          {label}
                        </span>
                      </div>
                      <Toggle
                        checked={notificationSettings[key]}
                        onChange={(e) => onChangeNotification?.(key, e.target.checked)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {openDropdown === 'job' &&
        jobRect &&
        createPortal(
          <JobDropdown
            style={{
              position: 'fixed',
              top: jobRect.bottom + 8,
              left: jobRect.left,
              width: jobRect.width,
              zIndex: 100,
            }}
            options={[
              '서비스·제품 기획',
              '프론트엔드·백엔드 개발',
              '디자인',
              '마케팅·세일즈',
              '데이터 분석',
              '고객 지원·CS',
              '인사·HR',
              '재무·회계',
              '교육·연구',
              '개인·프리랜서',
              '학생',
              '기타',
            ]}
            value={job}
            onChange={(value) => {
              setJob(value)
              setOpenDropdown(null)
            }}
          />,
          document.body,
        )}

      {openDropdown === 'career' &&
        careerRect &&
        createPortal(
          <CareerDropdown
            style={{
              position: 'fixed',
              top: careerRect.bottom + 8,
              left: careerRect.left,
              width: careerRect.width,
              zIndex: 100,
            }}
            options={['1년 미만', '1-3년', '3-5년', '5-10년', '10년 초과']}
            value={career}
            onChange={(value) => {
              setCareer(value)
              setOpenDropdown(null)
            }}
          />,
          document.body,
        )}

      {showWithdrawConfirm && (
        <ConfirmDialog
          message={
            <>
              <p>정말 탈퇴할까요?</p>
              <p>탈퇴 시 작성한 모든 내용이 삭제돼요.</p>
            </>
          }
          confirmLabel="네, 탈퇴할게요"
          cancelLabel="계속 사용할게요"
          onConfirm={() => setShowWithdrawConfirm(false)}
          onCancel={() => setShowWithdrawConfirm(false)}
        />
      )}
    </>
  )
}
