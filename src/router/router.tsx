import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/common/Layout/AppLayout'
import { SidebarPage } from '@/pages/Sidebar/SidebarPage'
import { TrashPage } from '@/pages/Sidebar/TrashPage'
import { PlanPage } from '@/pages/Sidebar/PlanPage'
import { LoginPage } from '@/pages/LoginPage'
import { SignupPage } from '@/pages/SignupPage'
import { EmailVerificationPage } from '@/pages/EmailVerificationPage'
import { MailNoticePage } from '@/pages/MailNoticePage'
import { ProfileSetupPage } from '@/pages/ProfileSetupPage'
import { DiarySearchPage } from '@/pages/DiarySearchPage'
import { LandingPreview } from '@/pages/LandingPreview/LandingPreview'
import { LandingPage } from '@/pages/LandingPage/LandingPage'
import { SocialSignupPage } from '@/pages/SocialSignupPage'

export const router = createBrowserRouter([
  {
    path: '/landing-preview',
    element: <LandingPreview />,
  },
  {
    path: '/landing',
    element: <LandingPage />,
  },
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
    path: '/records/search',
    element: <DiarySearchPage />,
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
    element: <AppLayout />,
    children: [
      {
        path: '/trash',
        element: <TrashPage />,
      },
      {
        path: '/plan',
        element: <PlanPage />,
      },
    ],
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
    path: '/social-signup',
    element: <SocialSignupPage />,
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
