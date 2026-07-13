import { ImagePreviewModal } from './ImagePreviewModal'
import { FilePreviewModal } from './FilePreviewModal'

export { isImageAttachment } from '@/utils/file'

export interface ResultPreviewTarget {
  kind: 'image' | 'file'
  name: string
  url: string
}

interface ResultPreviewModalProps {
  target: ResultPreviewTarget
  onClose: () => void
}

export function ResultPreviewModal({ target, onClose }: ResultPreviewModalProps) {
  if (target.kind === 'image') {
    return <ImagePreviewModal name={target.name} url={target.url} onClose={onClose} />
  }
  return <FilePreviewModal name={target.name} url={target.url} onClose={onClose} />
}
