import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createDashboard,
  createMonthlyDashboard,
  dashboardQueryKeys,
  getDashboardDetail,
  getDashboardEligibility,
  getDashboards,
  getMonthlyDashboardDetail,
  getMonthlyDashboards,
  getMonthlyEligibility,
} from '@/api/dashboard/dashboard'
import type { CreateDashboardPayload } from '@/types/dashboard'

export const useWeeklyEligibility = (workspaceId: string, baseDate: string) => {
  return useQuery({
    queryKey: dashboardQueryKeys.weeklyEligibility(workspaceId, baseDate),
    queryFn: () => getDashboardEligibility(workspaceId, baseDate),
    enabled: !!workspaceId,
  })
}

export const useWeeklyDashboards = (workspaceId: string, enabled: boolean) => {
  return useQuery({
    queryKey: dashboardQueryKeys.weeklyList(workspaceId),
    queryFn: () => getDashboards(workspaceId),
    enabled: !!workspaceId && enabled,
  })
}

export const useWeeklyDashboardDetail = (workspaceId: string, dashboardId: string | undefined) => {
  return useQuery({
    queryKey: dashboardId
      ? dashboardQueryKeys.weeklyDetail(workspaceId, dashboardId)
      : [...dashboardQueryKeys.workspace(workspaceId), 'weekly-detail', 'empty'],
    queryFn: () => getDashboardDetail(workspaceId, dashboardId as string),
    enabled: !!workspaceId && !!dashboardId,
  })
}

export const useCreateWeeklyDashboard = (workspaceId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateDashboardPayload) => {
      const created = await createDashboard(workspaceId, payload)
      if (!created.dashboardId) {
        throw new Error('생성 응답에 저장된 대시보드 ID가 없습니다')
      }
      return created
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.workspace(workspaceId) })
    },
  })
}

export const useMonthlyEligibility = (workspaceId: string, baseDate: string, enabled: boolean) => {
  return useQuery({
    queryKey: dashboardQueryKeys.monthlyEligibility(workspaceId, baseDate),
    queryFn: () => getMonthlyEligibility(workspaceId, baseDate),
    enabled: !!workspaceId && enabled,
  })
}

export const useMonthlyDashboards = (workspaceId: string, enabled: boolean) => {
  return useQuery({
    queryKey: dashboardQueryKeys.monthlyList(workspaceId),
    queryFn: () => getMonthlyDashboards(workspaceId),
    enabled: !!workspaceId && enabled,
  })
}

export const useMonthlyDashboardDetail = (workspaceId: string, dashboardId: string | undefined) => {
  return useQuery({
    queryKey: dashboardId
      ? dashboardQueryKeys.monthlyDetail(workspaceId, dashboardId)
      : [...dashboardQueryKeys.workspace(workspaceId), 'monthly-detail', 'empty'],
    queryFn: () => getMonthlyDashboardDetail(workspaceId, dashboardId as string),
    enabled: !!workspaceId && !!dashboardId,
  })
}

export const useCreateMonthlyDashboard = (workspaceId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateDashboardPayload) => {
      const created = await createMonthlyDashboard(workspaceId, payload)
      if (!created.dashboardId) {
        throw new Error('생성 응답에 저장된 대시보드 ID가 없습니다')
      }
      return created
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.workspace(workspaceId) })
    },
  })
}
