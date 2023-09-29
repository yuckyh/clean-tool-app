import columns from '@/features/columnsSlice'
import progress from '@/features/progressSlice'
import sheet from '@/features/sheetSlice'
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: { columns, progress, sheet },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
