import { request } from '@/lib/httpClient'
import type { HomeResult } from '@/types/home'

export const homeQueryKeys = {
  all: ['home'] as const,
}

export const getHome = async (): Promise<HomeResult> => {
  return request<HomeResult>('/home', {
    method: 'GET',
  })
}
