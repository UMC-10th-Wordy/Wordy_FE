export type ProjectTagColor =
  'black' | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'navy' | 'pink' | 'brown'

interface ProjectTagProps {
  label: string
  color: ProjectTagColor
}

const COLOR_CLASS_MAP: Record<ProjectTagColor, string> = {
  black: 'bg-[#f0f0f0] text-[#4d4d4d]',
  red: 'bg-[#ffe9ec] text-[#ff3f55]',
  orange: 'bg-[#ffede6] text-[#ff6d38]',
  yellow: 'bg-[#fff5dd] text-[#f7ad00]',
  green: 'bg-[#dcffe8] text-[#14c369]',
  blue: 'bg-[#e6f6ff] text-[#2d96ff]',
  navy: 'bg-[#f4f4ff] text-[#5d5df1]',
  pink: 'bg-[#ffeffb] text-[#ff5fd7]',
  brown: 'bg-[#f8efef] text-[#a77979]',
}

export default function ProjectTag({ label, color }: ProjectTagProps) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-lg px-2 py-1 ${COLOR_CLASS_MAP[color]}`}
    >
      <span className="font-['Pretendard'] text-base font-semibold leading-[1.6] whitespace-nowrap">
        {label}
      </span>
    </div>
  )
}
