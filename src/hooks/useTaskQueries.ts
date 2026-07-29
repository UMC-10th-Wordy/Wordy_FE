import { useSuspenseQuery } from '@tanstack/react-query'
import { getTasks, taskQueryKeys } from '@/api/task/task'
import { mapTaskDtoToTask } from '@/utils/taskMapper'

export const useGetTasksByDate = (date: string) => {
  return useSuspenseQuery({
    queryKey: taskQueryKeys.list(date),
    queryFn: () => getTasks(date),
    select: (dtos) => dtos.map(mapTaskDtoToTask),
  })
}
