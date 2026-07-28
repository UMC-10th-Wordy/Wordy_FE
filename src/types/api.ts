export interface ApiEnvelope<T> {
  success: boolean
  code: string
  message: string
  result: T
}
