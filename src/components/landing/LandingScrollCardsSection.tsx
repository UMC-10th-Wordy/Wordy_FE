import arrowDownImg from '@/assets/images/landing-arrow-down.svg?url'

const CARDS = [
  {
    title: '인수인계 관련 정리 필요',
    color: '#5D5DF1',
    date: '2025.06.09',
    content: (
      <>
        <p className="leading-relaxed mb-0">- 현재 맡고 있는 업무 목록 전부 작성</p>
        <p className="leading-relaxed mb-0">- 진행 중인 것 / 완료된 것 / 대기 중인 것 구분</p>
        <p className="leading-relaxed mb-0">- 관련 파일 폴더 정리 후 링크 한 곳에 모아두기</p>
        <p className="leading-relaxed mb-0">
          - 히스토리 모르면 막히는 부분 따로 설명 추가
          <br />
          <br />
          인수자가 보고 바로 이해할 수 있는 수준으로
        </p>
        <p className="leading-relaxed mb-0">
          말로 설명하면 빠뜨리는 게 생기니까 문서로 먼저 정리 필요!!
        </p>
        <p className="leading-relaxed">+) 마감 금요일까지</p>
      </>
    ),
  },
  {
    title: '오늘의 할 일',
    color: '#FF7CB7',
    date: '2026. 06. 04',
    content: (
      <>
        <p className="leading-relaxed mb-0">- 10:00 팀 회의</p>
        <p className="leading-relaxed mb-0">
          - 보고서 초안 작성
          <br /> =&gt; ASAP
        </p>
        <p className="leading-relaxed">
          - 거래처 메일 회신
          <br />
          <br />
          +) 오후에 시간 나면 저번에 미뤄둔 피그마 정리도 좀 해야 함.{' '}
          <span className="font-semibold">
            일단 보고서 먼저 끝내야 하니 회의 끝나고 바로 시작하기
          </span>
        </p>
      </>
    ),
  },
  {
    title: '2026 연말 평가',
    color: '#FED229',
    date: '2026. 08.26',
    content: (
      <>
        <p className="leading-relaxed mb-0">올해 한 것들 정리 필요 (기억이 안 남!!)</p>
        <p className="leading-relaxed mb-0">- 1분기: 온보딩 완료, OKR 세팅 참여</p>
        <p className="leading-relaxed mb-0">
          - 2분기: 디자인 시스템 컴포넌트 작업 (버튼, 인풋, 모달 등), 팀 내 컴포넌트 가이드 문서화
        </p>
        <p className="leading-relaxed mb-0">
          - 3분기: 신규 기능 UI 설계 3건, 사용성 테스트 2회 진행, 피드백 반영 후 재설계
        </p>
        <p className="leading-relaxed mb-0">
          - 4분기: 온보딩 자료 개편, 주간 보고서 체계화, 연말 결산 자료 준비 중
        </p>
        <p className="leading-relaxed mb-0">기억나는 것만 적어도 꽤 있는데 뭐가 더 있었더라...</p>
        <p className="leading-relaxed">
          🌟<span className="font-medium">내년부터는 월별로 그때그때 기록해두기로</span>🌟
        </p>
      </>
    ),
  },
  {
    title: '이번 주 완료 목록',
    color: '#36B6FF',
    date: '2026. 08.26',
    content: (
      <>
        <p className="leading-relaxed mb-0">
          - 주간 보고서 제출 완료
          <br />- 신입 교육 자료 정리 완료
        </p>
        <p className="leading-relaxed">
          다음 주에 월간 결산 마무리하고, 팀장님한테 중간 공유도 한 번 드려야 할 것 같음. 일정
          확인해보기!!
        </p>
      </>
    ),
  },
  {
    title: '주간 회의 준비',
    color: '#82DBCC',
    date: '2027.02.18',
    content: (
      <>
        <p className="leading-relaxed mb-0">회의 전 준비할 것들</p>
        <p className="leading-relaxed mb-0">- 저번 주 액션 아이템 완료 여부 확인</p>
        <p className="leading-relaxed mb-0">- 이번 주 진행 현황 슬라이드 2~3장으로 정리</p>
        <p className="leading-relaxed mb-0">- 팀원별 블로커 있는지 사전에 물어보기</p>
        <p className="leading-relaxed mb-0">
          - 숫자 들어가는 부분 최신화 필수 (저번에 틀렸음)
          <br />
          <br />
        </p>
        <p className="leading-relaxed">
          회의 30분 전까지는 자료 완성해두기
          <br />
          발표 순서도 미리 정해두는 게 나을 것 같음 → 팀장님한테 오전 중으로 공유드리기
          <br />
          회의록 작성 이번 주 내 차례인지 확인할 것.
        </p>
      </>
    ),
  },
]

function NoteCard({ title, color, date, content }: (typeof CARDS)[0]) {
  return (
    <div className="flex w-106.75 shrink-0 flex-col gap-4 overflow-hidden rounded-xl bg-(--color-bg-default) p-5 shadow-[0px_1px_5px_0px_rgba(0,0,0,0.1)]">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="[font-size:var(--font-size-body-2)] font-semibold leading-(--line-height-body) text-(--color-text-default) whitespace-nowrap">
            {title}
          </span>
          <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
        </div>
        <div className="flex gap-3 [font-size:var(--font-size-body-4)] font-medium leading-(--line-height-body) text-(--color-text-tertiary) whitespace-nowrap">
          <span>Date</span>
          <span>{date}</span>
        </div>
      </div>
      {/* divider — Figma: 0.5px */}
      <div className="relative h-0 w-full shrink-0">
        <div className="absolute inset-x-0 top-[-0.5px] h-px bg-(--color-border-subtle)" />
      </div>
      <div className="[font-size:var(--font-size-body-3)] font-normal leading-(--line-height-body) text-(--color-text-default)">
        {content}
      </div>
    </div>
  )
}

export function LandingScrollCardsSection() {
  const duplicated = [...CARDS, ...CARDS]

  return (
    <section
      className="relative w-full overflow-hidden bg-linear-to-b from-(--color-bg-default) to-(--color-bg-brand-light)"
      style={{ height: '871px' }}
    >
      {/* 타이틀 */}
      <p className="absolute left-1/2 top-15 -translate-x-1/2 whitespace-nowrap [font-size:var(--font-size-heading-2)] font-semibold leading-(--line-height-body) text-(--color-text-default)">
        업무 일지, 아직도 이렇게 쓰시나요?
      </p>

      {/* 무한 스크롤 카드 트랙 */}
      <div
        className="absolute flex gap-5 will-change-transform"
        style={{ top: '182px', animation: 'landing-scroll 35s linear infinite' }}
      >
        {duplicated.map((card, i) => (
          <NoteCard key={i} {...card} />
        ))}
      </div>

      {/* 좌우 페이드 마스크 — Figma: blur-[50px] + 그라디언트 */}
      <div
        className="pointer-events-none absolute right-[-128px] top-0 h-[737px] w-[408px] blur-[50px]"
        style={{
          backgroundImage:
            'linear-gradient(-12.12deg, var(--color-bg-brand-light, rgb(244,244,255)) 19.894%, rgba(255,255,255,0.5) 71.21%)',
        }}
      />
      <div className="pointer-events-none absolute left-[-128px] top-0 flex h-[737px] w-[408px] items-center justify-center">
        <div className="-scale-y-100 rotate-180">
          <div
            className="h-[737px] w-[408px] blur-[50px]"
            style={{
              backgroundImage:
                'linear-gradient(-12.12deg, var(--color-bg-brand-light, rgb(244,244,255)) 19.894%, rgba(255,255,255,0.5) 71.21%)',
            }}
          />
        </div>
      </div>

      {/* 하단 화살표 + 텍스트 — top: 677px, Figma: rotate-90 -scale-y-100 */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-7"
        style={{ top: '677px', width: '512px' }}
      >
        <img src={arrowDownImg} alt="" aria-hidden className="h-8 w-10" />
        <div className="flex flex-col items-center whitespace-nowrap">
          <p className="[font-size:var(--font-size-heading-3)] font-semibold leading-(--line-height-body) text-(--color-text-brand)">
            그래서, 내가 어떤 성과를 낸 거지?
          </p>
          <p className="[font-size:var(--font-size-body-2)] font-medium leading-(--line-height-body) text-(--color-text-tertiary)">
            데이터로 증명되지 않는 기록은 금방 잊혀져요. 워디가 도와줄게요!
          </p>
        </div>
      </div>
    </section>
  )
}
