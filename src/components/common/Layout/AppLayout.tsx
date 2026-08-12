import { Outlet, useLocation } from 'react-router-dom'
import { Scrollbar } from '@/components/common/Scrollbar/Scrollbar'
import { AsyncBoundary } from '@/components/common/AsyncState/AsyncBoundary'

export function AppLayout() {
  const { pathname } = useLocation()

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Scrollbar scrollbarClassName="py-2 pr-1" resetKey={pathname}>
        <AsyncBoundary>
          <Outlet />
        </AsyncBoundary>
      </Scrollbar>
    </div>
  )
}
