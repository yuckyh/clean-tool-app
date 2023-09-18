import { configureStore } from '@reduxjs/toolkit'

import columns from './columnsSlice'
import file from './fileSlice'
import progress from './progressSlice'
import sheet from './sheetSlice'

const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: [
          'payload.file',
          'meta.arg.file',
          'payload.Props.CreatedDate',
          'payload.Props.ModifiedDate',
        ],
        ignoredPaths: ['file.file', 'sheet.workbook'],
      },
    }),
  reducer: { columns, file, progress, sheet },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
