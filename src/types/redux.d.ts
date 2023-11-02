import type { AppDispatch } from '@/store'
import type { AsyncThunk } from '@reduxjs/toolkit'

interface AsyncThunkConfig {
  dispatch?: AppDispatch
  extra?: unknown
  fulfilledMeta?: unknown
  pendingMeta?: unknown
  rejectValue?: unknown
  rejectedMeta?: unknown
  serializedErrorType?: unknown
  state?: unknown
}

type GenericAsyncThunk = AsyncThunk<unknown, unknown, AsyncThunkConfig>
export type RejectedAction = Readonly<ReturnType<GenericAsyncThunk['rejected']>>
