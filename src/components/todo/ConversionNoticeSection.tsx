import { TextButton } from '@/components/common/Button/TextButton'
import ErrorIcon from '@/assets/icons/error.svg?react'
import GenerateIcon from '@/assets/icons/generate.svg?react'

const NOTICE_ITEMS = [
  'AI 성과 변환은 입력하신 업무 일지를 바탕으로 수집 및 분석이 진행됩니다.',
  '작성하신 내용에 외부 공유가 제한된 정보(기밀자료, 고객 정보 등)를 입력하지 않았는지 확인해 주세요.',
  `'동의 후 분석'을 클릭하시면 상기 내용에 동의하신 것으로 보아 성과 변환 서비스를 제공합니다.`,
  '입력된 데이터는 성과 분석 결과 생성을 위해 일시적으로 처리되며, 사용자의 동의 없이 외부에 공개되거나 제3자에게 제공되지 않습니다.',
]

interface ConversionNoticeSectionProps {
  isEnabled: boolean
  onConvert: () => void
}

/* 업무일지 -> 성과 변환 전 주의 사항 안내 + 변환 버튼 */
export function ConversionNoticeSection({ isEnabled, onConvert }: ConversionNoticeSectionProps) {
  return (
    <section className="flex w-full flex-col items-center gap-5 pb-[60px]">
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center gap-1">
          <ErrorIcon aria-hidden className="size-5 shrink-0 text-(--color-icon-error)" />
          <p className="[font-size:var(--font-size-body-4)] leading-(--line-height-body) font-semibold text-(--color-text-secondary)">
            변환 전, 주의 사항을 꼭 읽어주세요
          </p>
        </div>
        <div className="flex w-full flex-col gap-1 rounded-lg bg-(--color-bg-secondary) px-2 py-3">
          {NOTICE_ITEMS.map((item) => (
            <ul key={item} className="w-full list-disc">
              <li className="ms-[21px] [font-size:var(--font-size-body-4)] leading-(--line-height-body) font-medium text-(--color-text-tertiary)">
                {item}
              </li>
            </ul>
          ))}
        </div>
      </div>
      <TextButton
        type="button"
        variant="fill"
        size="large"
        fullWidth
        disabled={!isEnabled}
        onClick={onConvert}
        iconLeft={<GenerateIcon aria-hidden className="size-8" />}
      >
        동의하고 성과로 변환하기
      </TextButton>
    </section>
  )
}
