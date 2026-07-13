import { createBrowserRouter } from 'react-router-dom'
import { SidebarPage } from '@/pages/Sidebar/SidebarPage'
import { TrashPage } from '@/pages/Sidebar/TrashPage'
import { PlanPage } from '@/pages/Sidebar/PlanPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SidebarPage />,
  },
  {
    path: '/today',
    element: <SidebarPage />,
  },
  {
    path: '/records',
    element: <SidebarPage />,
  },
  {
    path: '/dashboard',
    element: <SidebarPage />,
  },
  {
    path: '/trash',
    element: <TrashPage />,
  },
  {
    path: '/plan',
    element: <PlanPage />,
  },
])
