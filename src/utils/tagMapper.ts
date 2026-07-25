import type { ProjectTagColor } from '@/components/todo/ProjectTag'
import type { TaskTag } from '@/types/todo'
import type { CreateTagPayload, TagDto } from '@/types/tagApi'

export const TAG_COLOR_HEX: Record<ProjectTagColor, string> = {
  black: '#4d4d4d',
  red: '#ff3f55',
  orange: '#ff6d38',
  yellow: '#ffc42f',
  green: '#14c369',
  blue: '#2d96ff',
  navy: '#5d5df1',
  pink: '#ff5fd7',
  brown: '#a77979',
}

export function hexToTagColor(hex: string): ProjectTagColor {
  const match = Object.entries(TAG_COLOR_HEX).find(
    ([, value]) => value.toLowerCase() === hex.toLowerCase(),
  )
  return (match?.[0] as ProjectTagColor) ?? 'black'
}

export function toApiDate(value: string): string {
  return value.replaceAll('.', '-')
}

export function fromApiDate(value: string): string {
  return value.slice(0, 10).replaceAll('-', '.')
}

export function mapTagDtoToTaskTag(dto: TagDto): TaskTag {
  return {
    id: dto.tagId,
    label: dto.tagName,
    color: hexToTagColor(dto.color),
    meta: {
      projectName: dto.projectName,
      purpose: dto.projectPurpose,
      expectedOutcome: dto.expectedOutcome,
      startDate: dto.expectedStartDate ? fromApiDate(dto.expectedStartDate) : undefined,
      endDate: dto.expectedEndDate ? fromApiDate(dto.expectedEndDate) : undefined,
      kpis: dto.kpis.map((kpi) => kpi.name),
    },
  }
}

export interface NewTagDraft {
  label: string
  color: ProjectTagColor
  projectName: string
  purpose: string
  expectedOutcome: string
  startDate: string
  endDate: string
  kpis: string[]
}

export function mapDraftToCreatePayload(draft: NewTagDraft): CreateTagPayload {
  return {
    tagName: draft.label,
    color: TAG_COLOR_HEX[draft.color],
    projectName: draft.projectName,
    projectPurpose: draft.purpose,
    expectedOutcome: draft.expectedOutcome,
    expectedStartDate: draft.startDate ? toApiDate(draft.startDate) : '',
    expectedEndDate: draft.endDate ? toApiDate(draft.endDate) : '',
    kpis: draft.kpis.map((name) => ({ name, target: '' })),
  }
}
