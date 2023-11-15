/**
 * @file This file contains the application's store.
 * @module app/store
 */

import data from '@/features/sheet/reducers'
import matches from '@/reducers/matches'
import progress from '@/reducers/progress'
import { configureStore } from '@reduxjs/toolkit'

/**
 * The application's store.
 *
 * Consists of the following slices:
 * - {@link matches}
 * - {@link progress}
 * - {@link data}
 */
const store = configureStore({
  reducer: { data, matches, progress },
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
