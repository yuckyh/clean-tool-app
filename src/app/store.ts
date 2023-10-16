import { configureStore } from '@reduxjs/toolkit'
import progress from '@/features/progress/reducers'
import columns from '@/features/columns/reducers'
import sheet from '@/features/sheet/reducers'

const store = configureStore({
  reducer: { progress, columns, sheet },
} as const)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
