/**
 * @file This file contains the type definitions for redux.
 * @module types/redux
 */

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
type RejectedAction = Readonly<ReturnType<GenericAsyncThunk['rejected']>>
