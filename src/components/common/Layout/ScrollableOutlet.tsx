import { Outlet } from 'react-router-dom'
import { Scrollbar } from '@/components/common/Scrollbar/Scrollbar'

export function ScrollableOutlet() {
  return (
    <Scrollbar className="flex-1" scrollbarClassName="py-2 pr-1">
      <Outlet />
    </Scrollbar>
  )
}
