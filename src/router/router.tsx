import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/common/Layout/AppLayout'
import { SidebarLayout } from '@/components/common/Layout/SidebarLayout'
import { ScrollableOutlet } from '@/components/common/Layout/ScrollableOutlet'
import { AsyncBoundary } from '@/components/common/AsyncState/AsyncBoundary'
import { HomePage } from '@/pages/HomePage'
import TodoListPage from '@/pages/TodoListPage'
import { DiaryListPage } from '@/pages/diary/DiaryListPage'
import { DiaryDetailPage } from '@/pages/diary/DiaryDetailPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { TrashPage } from '@/pages/trash/TrashPage'
import { PlanPage } from '@/pages/PlanPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { SignupPage } from '@/pages/auth/SignupPage'
import { EmailVerificationPage } from '@/pages/auth/EmailVerificationPage'
import { MailNoticePage } from '@/pages/auth/MailNoticePage'
import { ProfileSetupPage } from '@/pages/auth/ProfileSetupPage'
import { DiarySearchPage } from '@/pages/diary/DiarySearchPage'
import { TrashDiaryDetailPage } from '@/pages/trash/TrashDiaryDetailPage'
import { LandingPreview } from '@/pages/landing/LandingPreview'
import { LandingPage } from '@/pages/landing/LandingPage'
import { SocialSignupPage } from '@/pages/auth/SocialSignupPage'

export const router = createBrowserRouter([
  {
    element: <SidebarLayout />,
    children: [
      {
        element: <ScrollableOutlet />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/today', element: <TodoListPage /> },
          { path: '/records', element: <DiaryListPage /> },
          { path: '/dashboard', element: <DashboardPage /> },
        ],
      },
      {
        path: '/records/:diaryId',
        element: (
          <AsyncBoundary>
            <DiaryDetailPage />
          </AsyncBoundary>
        ),
      },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      { path: '/landing-preview', element: <LandingPreview /> },
      { path: '/landing', element: <LandingPage /> },
      { path: '/records/search', element: <DiarySearchPage /> },
      { path: '/trash', element: <TrashPage /> },
      { path: '/trash/:diaryId', element: <TrashDiaryDetailPage /> },
      { path: '/plan', element: <PlanPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
      { path: '/email-verification', element: <EmailVerificationPage /> },
      { path: '/mail-notice', element: <MailNoticePage /> },
      { path: '/profile-setup', element: <ProfileSetupPage /> },
      { path: '/social-signup', element: <SocialSignupPage /> },
    ],
  },
])
