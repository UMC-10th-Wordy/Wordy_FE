import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { getTasksCalendar, moveTaskToTomorrow, getTasks, taskQueryKeys } from '@/api/task/task'
import { mapTaskDtoToTask } from '@/utils/taskMapper'

interface MoveTaskToTomorrowVariables {
  taskId: string
  taskDate: string
}

export const useMoveTaskToTomorrow = () => {
  return useMutation({
    mutationFn: ({ taskId, taskDate }: MoveTaskToTomorrowVariables) =>
      moveTaskToTomorrow(taskId, {
        taskDate,
      }),
  })
}

export const useGetTasksByDate = (date: string) => {
  return useSuspenseQuery({
    queryKey: taskQueryKeys.list(date),
    queryFn: () => getTasks(date),
    select: (dtos) => dtos.map(mapTaskDtoToTask),
  })
}

export const useGetTasksCalendar = (
  year: number,
  month: number,
  startDate: string,
  endDate: string,
) => {
  return useQuery({
    queryKey: taskQueryKeys.calendar(year, month),
    queryFn: () => getTasksCalendar(startDate, endDate),
  })
}
