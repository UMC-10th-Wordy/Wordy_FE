import { useEffect, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { LoadFailedPreviewContent } from './PreviewStateMessages'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl

const PDF_MAX_SIZE = 400
const STACK_OFFSET_X = 8
const STACK_HEIGHT_STEP = 10

type PdfPreviewState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; pageCount: number; width: number; height: number; dataUrl: string }

function usePdfPreview(url: string): PdfPreviewState {
  const [state, setState] = useState<PdfPreviewState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    const loadingTask = pdfjsLib.getDocument(url)

    loadingTask.promise
      .then(async (pdf) => {
        const page = await pdf.getPage(1)
        const baseViewport = page.getViewport({ scale: 1 })
        const scale = PDF_MAX_SIZE / Math.max(baseViewport.width, baseViewport.height)
        const viewport = page.getViewport({ scale })

        const canvas = document.createElement('canvas')
        canvas.width = viewport.width
        canvas.height = viewport.height
        const context = canvas.getContext('2d')
        if (!context) throw new Error('canvas context를 생성할 수 없어요')

        await page.render({ canvasContext: context, viewport }).promise
        if (cancelled) return

        setState({
          status: 'ready',
          pageCount: pdf.numPages,
          width: viewport.width,
          height: viewport.height,
          dataUrl: canvas.toDataURL(),
        })
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error' })
      })

    return () => {
      cancelled = true
      loadingTask.destroy()
    }
  }, [url])

  return state
}

/* pdf 뒤에 붙는 장 수 카운트 */
function getBackCardCount(pageCount: number) {
  if (pageCount <= 1) return 0
  if (pageCount === 2) return 1
  return 2
}

export function PdfPreviewContent({ url }: { url: string }) {
  const state = usePdfPreview(url)

  if (state.status === 'loading') {
    return (
      <div className="flex w-full flex-col items-center gap-4 pt-8 pb-7">
        <p className="[font-size:var(--font-size-body-2)] leading-(--line-height-body) font-normal text-(--color-text-tertiary)">
          미리보기를 불러오는 중이에요
        </p>
      </div>
    )
  }

  if (state.status === 'error') {
    return <LoadFailedPreviewContent />
  }

  /* 뒷장(흰색) 카드 배열 -> [0]은 실제 pdf 첫 페이지 */
  const backCardCount = getBackCardCount(state.pageCount)
  const cardHeights = [
    state.height,
    ...Array.from(
      { length: backCardCount },
      (_, index) => state.height - STACK_HEIGHT_STEP * (index + 1),
    ),
  ]

  return (
    <div className="isolate flex items-center drop-shadow-[0px_1px_7.5px_rgba(0,0,0,0.1)]">
      {cardHeights.map((height, index) => {
        const isLast = index === cardHeights.length - 1
        const style = {
          width: state.width,
          height,
          marginRight: isLast ? undefined : -(state.width - STACK_OFFSET_X),
          zIndex: cardHeights.length - index,
        }

        if (index === 0) {
          return (
            <img
              key="front"
              src={state.dataUrl}
              alt=""
              style={style}
              className="relative shrink-0 rounded-lg border border-(--color-border-brand-subtle) object-cover shadow-[0px_1px_5px_0px_rgba(0,0,0,0.1)]"
            />
          )
        }

        return (
          <div
            key={index}
            style={style}
            className="relative shrink-0 rounded-lg border border-(--color-border-brand-subtle) bg-(--color-bg-brand-subtle)"
          />
        )
      })}
    </div>
  )
}
