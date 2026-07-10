import { useState } from 'react'
import type { HTMLAttributes } from 'react'
import { SidebarTap } from '../SidebarTap/SidebarTap'
import { Input1 } from '@/components/common/Input/Input1'
import { Toggle } from '@/components/common/Toggle/Toggle'
import { TextButton } from '@/components/common/Button/TextButton'
import { IconButton } from '@/components/common/Button/IconButton'
import { JobDropdown } from '../JobDropdown/JobDropdown'
import { CareerDropdown } from '../CareerDropdown/CareerDropdown'
import XMarkIcon from '@/assets/icons/x-mark.svg?react'
import CameraIcon from '@/assets/icons/camera.svg?react'
import DirectionBottomIcon from '@/assets/icons/Direction=bottom.svg?react'

export type SettingTab = 'profile' | 'notification'
type InnerView = 'main' | 'password'

export interface SettingPanelProps extends HTMLAttributes<HTMLDivElement> {
  initialTab?: SettingTab
  // 프로필
  profileName?: string
  profileEmail?: string
  profileJob?: string
  profileCareer?: string
  onSaveProfile?: (data: { name: string; job: string; career: string }) => void
  // 알림
  notificationSettings?: Record<string, boolean>
  onChangeNotification?: (key: string, value: boolean) => void
  onClose?: () => void
}

export function SettingPanel({
  initialTab = 'profile',
  profileName = '',
  profileEmail = '',
  profileJob = '',
  profileCareer = '',
  onSaveProfile,
  notificationSettings = {},
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
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const profileChanged = name !== profileName || job !== profileJob || career !== profileCareer

  const passwordMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword
  const passwordReady = currentPassword.length > 0 && newPassword.length > 0 && !passwordMismatch

  const handleSave = () => {
    onSaveProfile?.({ name, job, career })
  }

  return (
    <div
      className={[
        'bg-(--color-bg-default) rounded-(--scale-12) shadow-[0px_1px_7.5px_rgba(0,0,0,0.1)]',
        'flex items-center h-150 w-215',
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
      <div className="flex flex-1 flex-col h-full items-start justify-between min-w-0 overflow-y-auto p-5">
        {currentTab === 'profile' && innerView === 'password' ? (
          <>
            <div className="flex flex-col gap-6 items-start shrink-0 w-full">
              <div className="flex items-start justify-between shrink-0 w-full">
                <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-semibold text-(--color-text-secondary) whitespace-nowrap">
                  비밀번호 변경
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
                <Input1
                  label="현재 비밀번호"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="현재 비밀번호 입력"
                />
                <Input1
                  label="새 비밀번호"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="새 비밀번호 입력"
                />
                <Input1
                  label="새 비밀번호 확인"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="새 비밀번호 재입력"
                  error={passwordMismatch ? '비밀번호가 일치하지 않습니다.' : undefined}
                  success={
                    !passwordMismatch && confirmPassword.length > 0
                      ? '비밀번호가 일치합니다.'
                      : undefined
                  }
                />
              </div>
            </div>
            <div className="flex items-center justify-between shrink-0 w-full">
              <TextButton variant="text_only" size="large" onClick={() => setInnerView('main')}>
                돌아가기
              </TextButton>
              <TextButton variant="fill" size="large" disabled={!passwordReady}>
                변경하기
              </TextButton>
            </div>
          </>
        ) : currentTab === 'profile' ? (
          <>
            <div className="flex flex-col gap-6 items-start shrink-0 w-full">
              {/* 헤더 */}
              <div className="flex items-start justify-between shrink-0 w-full">
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
                  <div className="size-29.5 rounded-(--scale-1000) border border-(--color-border-opacity) overflow-hidden bg-(--color-bg-secondary)" />
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 size-9.5 rounded-full bg-(--color-icon-brand) border-2 border-(--color-border-inverse) flex items-center justify-center"
                    aria-label="프로필 사진 변경"
                  >
                    <CameraIcon
                      width={24}
                      height={24}
                      className="[&_path]:stroke-white [&_circle]:stroke-white"
                    />
                  </button>
                </div>

                {/* 입력 필드 */}
                <div className="flex flex-col gap-3 flex-1 min-w-0">
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
                  <div className="flex items-center gap-5 relative">
                    <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-medium text-(--color-text-tertiary) text-right w-17 shrink-0">
                      직무
                    </span>
                    <button
                      type="button"
                      className="flex-1 flex items-center justify-between bg-(--color-bg-default) border border-(--color-border-subtle) rounded-lg pl-5 pr-4 py-2.5 cursor-pointer"
                      onClick={() => setOpenDropdown((v) => (v === 'job' ? null : 'job'))}
                    >
                      <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-default)">
                        {job || '선택'}
                      </span>
                      <DirectionBottomIcon
                        width={24}
                        height={24}
                        className="shrink-0 text-(--color-icon-secondary)"
                      />
                    </button>
                    {openDropdown === 'job' && (
                      <div className="absolute top-full left-22 mt-2 z-10">
                        <JobDropdown
                          options={[
                            '서비스·제품 기획',
                            '프론트엔드·백엔드 개발',
                            '디자인',
                            '마케팅·세일즈',
                            '데이터 분석',
                          ]}
                          value={job}
                          onChange={(value) => {
                            setJob(value)
                            setOpenDropdown(null)
                          }}
                        />
                      </div>
                    )}
                  </div>
                  {/* 재직 연차 */}
                  <div className="flex items-center gap-5 relative">
                    <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-medium text-(--color-text-tertiary) text-right w-17 shrink-0">
                      재직 연차
                    </span>
                    <button
                      type="button"
                      className="flex-1 flex items-center justify-between bg-(--color-bg-default) border border-(--color-border-subtle) rounded-lg pl-5 pr-4 py-2.5 cursor-pointer"
                      onClick={() => setOpenDropdown((v) => (v === 'career' ? null : 'career'))}
                    >
                      <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-default)">
                        {career || '선택'}
                      </span>
                      <DirectionBottomIcon
                        width={24}
                        height={24}
                        className="shrink-0 text-(--color-icon-secondary)"
                      />
                    </button>
                    {openDropdown === 'career' && (
                      <div className="absolute top-full left-22 mt-2 z-10">
                        <CareerDropdown
                          options={['1년 미만', '1-3년', '3-5년', '5-10년', '10년 초과']}
                          value={career}
                          onChange={(value) => {
                            setCareer(value)
                            setOpenDropdown(null)
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 하단 버튼 */}
            <div className="flex items-center justify-between shrink-0 w-full">
              <TextButton variant="text_only" size="large">
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
              <div className="flex items-start justify-between shrink-0 w-full">
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
                {Object.entries(notificationSettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-default)">
                      {key}
                    </span>
                    <Toggle
                      checked={value}
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
  )
}
