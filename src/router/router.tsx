import { createBrowserRouter } from 'react-router-dom'
import { SidebarPage } from '@/pages/Sidebar/SidebarPage'
import { TrashPage } from '@/pages/Sidebar/TrashPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SidebarPage />,
  },
  {
    path: '/trash',
    element: <TrashPage />,
  },
])
