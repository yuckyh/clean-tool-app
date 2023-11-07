import columns from '@/features/columns/reducers'
import progress from '@/features/progress/reducers'
import sheet from '@/features/sheet/reducers'
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: { columns, progress, sheet },
} as const)

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
