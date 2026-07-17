import { createBrowserRouter } from 'react-router-dom'
import { SidebarPage } from '@/pages/Sidebar/SidebarPage'
import { TrashPage } from '@/pages/Sidebar/TrashPage'
import { PlanPage } from '@/pages/Sidebar/PlanPage'
import { LoginPage } from '@/pages/LoginPage'
import { SignupPage } from '@/pages/SignupPage'
import { EmailVerificationPage } from '@/pages/EmailVerificationPage'
import { MailNoticePage } from '@/pages/MailNoticePage'
import { ProfileSetupPage } from '@/pages/ProfileSetupPage'

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
    path: '/records/:diaryId',
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
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/email-verification',
    element: <EmailVerificationPage />,
  },
  {
    path: '/mail-notice',
    element: <MailNoticePage />,
  },
  {
    path: '/profile-setup',
    element: <ProfileSetupPage />,
  },
])
