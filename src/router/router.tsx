import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/common/Layout/AppLayout'
import { SidebarLayout } from '@/components/common/Layout/SidebarLayout'
import { ScrollableOutlet } from '@/components/common/Layout/ScrollableOutlet'
import { AsyncBoundary } from '@/components/common/AsyncState/AsyncBoundary'
import { HomePage } from '@/pages/Home/Home'
import TodoListPage from '@/pages/TodoListPage/TodoListPage'
import { DiaryListPage } from '@/pages/DiaryListPage/DiaryListPage'
import { DiaryDetailPage } from '@/pages/DiaryDetailPage/DiaryDetailPage'
import { WeeklyDashboard } from '@/components/dashboard/WeeklyDashboard'
import { TrashPage } from '@/pages/Sidebar/TrashPage'
import { PlanPage } from '@/pages/Sidebar/PlanPage'
import { LoginPage } from '@/pages/LoginPage/LoginPage'
import { SignupPage } from '@/pages/SignupPage/SignupPage'
import { EmailVerificationPage } from '@/pages/EmailVerificationPage/EmailVerificationPage'
import { MailNoticePage } from '@/pages/MailNoticePage/MailNoticePage'
import { ProfileSetupPage } from '@/pages/ProfileSetupPage/ProfileSetupPage'
import { DiarySearchPage } from '@/pages/DiarySearchPage/DiarySearchPage'
import { TrashDiaryDetailPage } from '@/pages/TrashDiaryDetailPage/TrashDiaryDetailPage'
import { LandingPreview } from '@/pages/LandingPreview/LandingPreview'
import { LandingPage } from '@/pages/LandingPage/LandingPage'
import { SocialSignupPage } from '@/pages/SocialSignupPage/SocialSignupPage'

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
          { path: '/dashboard', element: <WeeklyDashboard /> },
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
