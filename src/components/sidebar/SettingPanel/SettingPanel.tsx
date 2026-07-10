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

export type SettingTab = 'profile' | 'notification'

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
  const [name, setName] = useState(profileName)
  const [job, setJob] = useState(profileJob)
  const [career, setCareer] = useState(profileCareer)
  const [showJobDropdown, setShowJobDropdown] = useState(false)
  const [showCareerDropdown, setShowCareerDropdown] = useState(false)

  const handleSave = () => {
    onSaveProfile?.({ name, job, career })
  }

  return (
    <div
      className={[
        'bg-(--color-bg-default) rounded-[var(--scale-12)] shadow-[0px_1px_7.5px_rgba(0,0,0,0.1)]',
        'flex items-center h-[600px] w-[860px]',
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
        {currentTab === 'profile' ? (
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
                  <div className="size-[118px] rounded-[var(--scale-1000)] border border-(--color-border-opacity) overflow-hidden bg-(--color-bg-secondary)" />
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 size-[38px] rounded-full bg-(--color-icon-brand) border-2 border-(--color-border-inverse) flex items-center justify-center"
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
                  <Input1 label="닉네임" value={name} onChange={(e) => setName(e.target.value)} />
                  <div className="flex items-center gap-5">
                    <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-medium text-(--color-text-tertiary)">
                      이메일
                    </span>
                    <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-default)">
                      {profileEmail}
                    </span>
                  </div>
                  <div className="flex items-center gap-5">
                    <span className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-medium text-(--color-text-tertiary)">
                      비밀번호
                    </span>
                    <TextButton variant="stroke" size="medium">
                      비밀번호 변경하기
                    </TextButton>
                  </div>
                  <div className="relative">
                    <Input1
                      label="직무"
                      value={job}
                      readOnly
                      onClick={() => setShowJobDropdown((v) => !v)}
                      className="cursor-pointer"
                    />
                    {showJobDropdown && (
                      <div className="absolute top-full left-0 mt-2 z-10">
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
                            setShowJobDropdown(false)
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <Input1
                      label="재직 연차"
                      value={career}
                      readOnly
                      onClick={() => setShowCareerDropdown((v) => !v)}
                      className="cursor-pointer"
                    />
                    {showCareerDropdown && (
                      <div className="absolute top-full left-0 mt-2 z-10">
                        <CareerDropdown
                          options={['1년 미만', '1-3년', '3-5년', '5-10년', '10년 초과']}
                          value={career}
                          onChange={(value) => {
                            setCareer(value)
                            setShowCareerDropdown(false)
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
              <TextButton variant="fill" size="large" onClick={handleSave}>
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
