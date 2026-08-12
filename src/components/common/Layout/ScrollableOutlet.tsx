import { Outlet, useLocation } from 'react-router-dom'
import { Scrollbar } from '@/components/common/Scrollbar/Scrollbar'
import { AsyncBoundary } from '@/components/common/AsyncState/AsyncBoundary'

export function ScrollableOutlet() {
  const { pathname } = useLocation()

  return (
    <Scrollbar className="flex-1" scrollbarClassName="py-2 pr-1" resetKey={pathname}>
      <AsyncBoundary>
        <Outlet />
      </AsyncBoundary>
    </Scrollbar>
  )
}
