/**
 * @file This file contains the application's store.
 * @module app/store
 */

import columns from '@/features/columns/reducers'
import progress from '@/features/progress/reducers'
import sheet from '@/features/sheet/reducers'
import { configureStore } from '@reduxjs/toolkit'

/**
 * The application's store.
 *
 * Consists of the following slices:
 * - {@link columns}
 * - {@link progress}
 * - {@link sheet}
 */
const store = configureStore({
  reducer: { columns, progress, sheet },
} as const)

/**
 * The type of the application's state.
 */
export type AppState = ReturnType<typeof store.getState>

/**
 * The type of the application's dispatch.
 */
export type AppDispatch = typeof store.dispatch

export default store
