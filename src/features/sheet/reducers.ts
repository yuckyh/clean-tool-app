import type { PayloadAction } from '@reduxjs/toolkit'
import type { WorkSheet, BookType } from 'xlsx'

import { getPersisted, setPersisted } from '@/lib/utils'
import { createSlice } from '@reduxjs/toolkit'

import { deleteWorkbook, fetchWorkbook, postFile } from './actions'

interface WorkbookState {
  sheets: Record<string, WorkSheet>
  sheetNames: string[]
}

interface State {
  original: WorkbookState
  edited: WorkbookState
  bookType?: BookType
  sheetName: string
  fileName: string
  visits: string[]
}

const name = 'sheet'
const defaultValue = ''
const fileNameKey = 'fileName'
const visitsKey = 'visits'
const initialWorkbookState: WorkbookState = {
  sheetNames: [],
  sheets: {},
}

const initialState: State = {
  visits: getPersisted(visitsKey, defaultValue).split(',').filter(Boolean),
  fileName: getPersisted(fileNameKey, defaultValue),
  sheetName: getPersisted(name, defaultValue),
  original: initialWorkbookState,
  edited: initialWorkbookState,
}

const sheetSlice = createSlice({
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkbook.fulfilled, (state, { payload }) => {
        const { SheetNames, fileName, bookType, Sheets } = payload

        if ([SheetNames, Sheets, bookType].some((item) => !item)) {
          return
        }

        const workbookState = {
          sheetNames: SheetNames ?? [],
          sheets: Sheets ?? {},
        }
        if (fileName.includes('.formatted.')) {
          state.edited = workbookState
        } else {
          state.original = workbookState
        }
        if (!state.sheetName) {
          state.sheetName = SheetNames?.[0] ?? defaultValue
        }
        state.bookType = bookType
      })
      .addCase(postFile.fulfilled, (state, { payload }) => {
        state.fileName = payload
      })
      .addCase(deleteWorkbook.fulfilled, (state) => {
        state = { ...initialState }
        state.fileName = defaultValue
        state.sheetName = defaultValue
        state.visits = []

        return state
      })
  },
  reducers: {
    saveSheetState: (state) => {
      const { sheetName, fileName, visits } = state

      setPersisted(name, sheetName)
      setPersisted(fileNameKey, fileName)
      setPersisted(visitsKey, visits.join(','))
    },
    setVisit: (
      state,
      { payload }: PayloadAction<{ visit: string; pos: number }>,
    ) => {
      const { visit, pos } = payload
      state.visits[pos] = visit
    },
    pushVisit: (state) => {
      const { visits } = state
      visits.push((visits.length + 1).toString())
      state.visits = visits
    },
    popVisit: (state) => {
      const { visits } = state
      visits.pop()
      state.visits = visits
    },
    setSheetName: (state, { payload }: PayloadAction<string>) => {
      state.sheetName = payload
    },
    deleteVisits: (state) => {
      state.visits = []
    },
  },
  initialState: initialState,
  name,
})

export const {
  saveSheetState,
  deleteVisits,
  setSheetName,
  pushVisit,
  popVisit,
  setVisit,
} = sheetSlice.actions
export default sheetSlice.reducer
