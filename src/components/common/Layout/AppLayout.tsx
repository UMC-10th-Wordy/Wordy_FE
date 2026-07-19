import { Outlet } from 'react-router-dom'
import { Scrollbar } from '@/components/common/Scrollbar/Scrollbar'

export function AppLayout() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Scrollbar scrollbarClassName="py-2 pr-1">
        <Outlet />
      </Scrollbar>
    </div>
  )
}
