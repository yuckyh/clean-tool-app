import progress from '@/features/progress/reducers'
import columns from '@/features/columns/reducers'
import { configureStore } from '@reduxjs/toolkit'
import sheet from '@/features/sheet/reducers'

const store = configureStore({
  reducer: { progress, columns, sheet },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
