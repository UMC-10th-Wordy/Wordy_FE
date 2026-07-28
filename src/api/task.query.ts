import { useSuspenseQuery } from '@tanstack/react-query'
import { getTasks } from './taskApi'
import { mapTaskDtoToTask } from '@/utils/taskMapper'

export const taskQueryKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskQueryKeys.all, 'list'] as const,
  list: (date: string) => [...taskQueryKeys.lists(), date] as const,
}

export const useGetTasksByDate = (date: string) => {
  return useSuspenseQuery({
    queryKey: taskQueryKeys.list(date),
    queryFn: () => getTasks(date),
    select: (dtos) => dtos.map(mapTaskDtoToTask),
  })
}
