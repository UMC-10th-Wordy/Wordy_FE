import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/common/Layout/AppLayout'
import { SidebarLayout } from '@/components/common/Layout/SidebarLayout'
import { ScrollableOutlet } from '@/components/common/Layout/ScrollableOutlet'
import { AsyncBoundary } from '@/components/common/AsyncState/AsyncBoundary'
import { ProtectedRoute } from '@/components/common/Layout/ProtectedRoute'
import { GuestRoute } from '@/components/common/Layout/GuestRoute'

const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })))
const TodoListPage = lazy(() => import('@/pages/TodoListPage'))
const DiaryListPage = lazy(() =>
  import('@/pages/diary/DiaryListPage').then((m) => ({ default: m.DiaryListPage })),
)
const DiaryDetailPage = lazy(() =>
  import('@/pages/diary/DiaryDetailPage').then((m) => ({ default: m.DiaryDetailPage })),
)
const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const TrashPage = lazy(() =>
  import('@/pages/trash/TrashPage').then((m) => ({ default: m.TrashPage })),
)
const PlanPage = lazy(() => import('@/pages/PlanPage').then((m) => ({ default: m.PlanPage })))
const LoginPage = lazy(() =>
  import('@/pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })),
)
const SignupPage = lazy(() =>
  import('@/pages/auth/SignupPage').then((m) => ({ default: m.SignupPage })),
)
const EmailVerificationPage = lazy(() =>
  import('@/pages/auth/EmailVerificationPage').then((m) => ({
    default: m.EmailVerificationPage,
  })),
)
const MailNoticePage = lazy(() =>
  import('@/pages/auth/MailNoticePage').then((m) => ({ default: m.MailNoticePage })),
)
const ProfileSetupPage = lazy(() =>
  import('@/pages/auth/ProfileSetupPage').then((m) => ({ default: m.ProfileSetupPage })),
)
const DiarySearchPage = lazy(() =>
  import('@/pages/diary/DiarySearchPage').then((m) => ({ default: m.DiarySearchPage })),
)
const TrashDiaryDetailPage = lazy(() =>
  import('@/pages/trash/TrashDiaryDetailPage').then((m) => ({
    default: m.TrashDiaryDetailPage,
  })),
)
const LandingPreview = lazy(() =>
  import('@/pages/landing/LandingPreview').then((m) => ({ default: m.LandingPreview })),
)
const LandingPage = lazy(() =>
  import('@/pages/landing/LandingPage').then((m) => ({ default: m.LandingPage })),
)
const SocialSignupPage = lazy(() =>
  import('@/pages/auth/SocialSignupPage').then((m) => ({ default: m.SocialSignupPage })),
)
const GoogleCallbackPage = lazy(() =>
  import('@/pages/auth/GoogleCallbackPage').then((m) => ({ default: m.GoogleCallbackPage })),
)

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
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
    ],
  },
  {
    element: <AppLayout />,
    children: [
      {
        element: <GuestRoute />,
        children: [
          { path: '/landing', element: <LandingPage /> },
          { path: '/login', element: <LoginPage /> },
          { path: '/signup', element: <SignupPage /> },
        ],
      },
      { path: '/landing-preview', element: <LandingPreview /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/records/search', element: <DiarySearchPage /> },
          { path: '/trash', element: <TrashPage /> },
          { path: '/trash/:diaryId', element: <TrashDiaryDetailPage /> },
          { path: '/plan', element: <PlanPage /> },
          { path: '/profile-setup', element: <ProfileSetupPage /> },
        ],
      },
      { path: '/verify-email', element: <EmailVerificationPage /> },
      { path: '/mail-notice', element: <MailNoticePage /> },
      { path: '/social-signup', element: <SocialSignupPage /> },
      { path: '/oauth/callback', element: <GoogleCallbackPage /> },
    ],
  },
])
