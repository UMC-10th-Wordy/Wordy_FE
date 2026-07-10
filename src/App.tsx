import { Sidebar } from '@/components/sidebar'
import HomeIcon from '@/assets/icons/home.svg?react'
import BellIcon from '@/assets/icons/bell.svg?react'
import CalendarIcon from '@/assets/icons/calendar.svg?react'
import DocumentIcon from '@/assets/icons/document.svg?react'
import ChartIcon from '@/assets/icons/chart.svg?react'

function App() {
  const pages = [
    { page: '홈' as const, icon: <HomeIcon className="size-6" />, category: 'general' as const },
    {
      page: '알림함' as const,
      icon: <BellIcon className="size-6" />,
      badge: 99,
      category: 'general' as const,
    },
    {
      page: '오늘의업무' as const,
      icon: <CalendarIcon className="size-6" />,
      category: 'feature' as const,
    },
    {
      page: '일지모아보기' as const,
      icon: <DocumentIcon className="size-6" />,
      category: 'feature' as const,
    },
    {
      page: '성과대시보드' as const,
      icon: <ChartIcon className="size-6" />,
      category: 'feature' as const,
    },
  ]

  return (
    <div className="flex min-h-screen bg-(--color-bg-default)">
      <Sidebar
        page="홈"
        status="open"
        pages={pages}
        workspaceName="내 워크스페이스"
        userName="홍길동"
        userPlan="Free"
      />
    </div>
  )
}

export default App
