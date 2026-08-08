import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { moveTaskToTomorrow, getTasks, taskQueryKeys } from '@/api/task/task'
import { mapTaskDtoToTask } from '@/utils/taskMapper'

interface MoveTaskToTomorrowVariables {
  taskId: string
  taskDate: string
}

export const useMoveTaskToTomorrow = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, taskDate }: MoveTaskToTomorrowVariables) =>
      moveTaskToTomorrow(taskId, {
        taskDate,
      }),

    onSuccess: (_data, variables) => {
      queryClient.removeQueries({
        queryKey: taskQueryKeys.list(variables.taskDate),
        exact: true,
      })

      void queryClient.invalidateQueries({
        queryKey: taskQueryKeys.all,
      })
    },
  })
}

export const useGetTasksByDate = (date: string) => {
  return useSuspenseQuery({
    queryKey: taskQueryKeys.list(date),
    queryFn: () => getTasks(date),
    select: (dtos) => dtos.map(mapTaskDtoToTask),
  })
}
