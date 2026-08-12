import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { getTasksCalendar, moveTaskToTomorrow, getTasks, taskQueryKeys } from '@/api/task/task'
import { homeQueryKeys } from '@/api/home/home'
import { useActiveWorkspaceId } from '@/hooks/useWorkspaceQueries'
import { mapTaskDtoToTask } from '@/utils/taskMapper'

interface MoveTaskToTomorrowVariables {
  taskId: string
  taskDate: string
}

export const useMoveTaskToTomorrow = () => {
  const queryClient = useQueryClient()
  const workspaceId = useActiveWorkspaceId()

  return useMutation({
    mutationFn: ({ taskId, taskDate }: MoveTaskToTomorrowVariables) =>
      moveTaskToTomorrow(workspaceId, taskId, {
        taskDate,
      }),

    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: homeQueryKeys.all(workspaceId) })
      void queryClient.invalidateQueries({ queryKey: taskQueryKeys.calendars(workspaceId) })
    },
  })
}

export const useGetTasksByDate = (date: string) => {
  const workspaceId = useActiveWorkspaceId()

  return useSuspenseQuery({
    queryKey: taskQueryKeys.list(workspaceId, date),
    queryFn: () => getTasks(workspaceId, date),
    select: (dtos) => dtos.map(mapTaskDtoToTask),
  })
}

export const useGetTasksCalendar = (
  year: number,
  month: number,
  startDate: string,
  endDate: string,
) => {
  const workspaceId = useActiveWorkspaceId()

  return useQuery({
    queryKey: taskQueryKeys.calendar(workspaceId, year, month),
    queryFn: () => getTasksCalendar(workspaceId, startDate, endDate),
    enabled: Boolean(workspaceId),
  })
}
