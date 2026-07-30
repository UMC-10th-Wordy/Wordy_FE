import { Checkbox } from '@/components/common/Checkbox/Checkbox'
import type { AgreementType, SignupAgreement } from '@/types/auth'

export interface TermsState {
  age: boolean
  service: boolean
  privacy: boolean
  marketing: boolean
}

interface TermsSectionProps {
  terms: TermsState
  onChange: (terms: TermsState) => void
}

const TERM_ITEMS: {
  key: keyof TermsState
  required: boolean
  label: string
  hasDetail: boolean
  agreementType: AgreementType
}[] = [
  {
    key: 'age',
    required: true,
    label: '만 14세 이상입니다',
    hasDetail: false,
    agreementType: 'AGE_OVER_14',
  },
  {
    key: 'service',
    required: true,
    label: '서비스 이용약관',
    hasDetail: true,
    agreementType: 'TERMS_OF_SERVICE',
  },
  {
    key: 'privacy',
    required: true,
    label: '개인정보 수집 및 이용',
    hasDetail: true,
    agreementType: 'PRIVACY_POLICY',
  },
  {
    key: 'marketing',
    required: false,
    label: '마케팅 정보 수신 및 프로모션 안내',
    hasDetail: true,
    agreementType: 'MARKETING',
  },
]

// 필수 약관 정의를 TERM_ITEMS 단일 소스로 관리하기 위한 헬퍼
export const isRequiredTermsChecked = (terms: TermsState) =>
  TERM_ITEMS.filter((item) => item.required).every((item) => terms[item.key])

// 회원가입 API 요청 바디로 변환하기 위한 헬퍼 (TERM_ITEMS 단일 소스 유지)
export const termsToAgreements = (terms: TermsState): SignupAgreement[] =>
  TERM_ITEMS.map((item) => ({ type: item.agreementType, isAgreed: terms[item.key] }))

export const TermsSection = ({ terms, onChange }: TermsSectionProps) => {
  const allChecked = Object.values(terms).every(Boolean)

  const handleAllChange = (checked: boolean) => {
    onChange({ age: checked, service: checked, privacy: checked, marketing: checked })
  }

  const handleItemChange = (key: keyof TermsState, checked: boolean) => {
    onChange({ ...terms, [key]: checked })
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-(--color-text-default)">약관 동의</h2>

      <Checkbox
        label={<span className="font-bold">아래 내용에 모두 동의합니다</span>}
        checked={allChecked}
        onChange={(e) => handleAllChange(e.target.checked)}
      />

      <div className="h-px w-full bg-(--color-border-subtle)" />

      {TERM_ITEMS.map(({ key, required, label, hasDetail }) => (
        <div key={key} className="flex items-center justify-between">
          <Checkbox
            label={
              <span>
                <span
                  className={
                    required ? 'text-(--color-button-default)' : 'text-(--color-text-tertiary)'
                  }
                >
                  ({required ? '필수' : '선택'})
                </span>{' '}
                {label}
              </span>
            }
            checked={terms[key]}
            onChange={(e) => handleItemChange(key, e.target.checked)}
          />
          {hasDetail && (
            // TODO(#18): 약관 전문 모달/페이지 연결
            <button
              type="button"
              className="[font-size:var(--font-size-body-4)] font-medium leading-(--line-height-body) text-(--color-button-default)"
            >
              전체보기
            </button>
          )}
        </div>
      ))}
    </section>
  )
}
