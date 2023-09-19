import type { PayloadAction } from '@reduxjs/toolkit'
import type { WorkBook, WorkSheet } from 'xlsx'

import { promisifyListener, workbookWorker } from '@/workers/static'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getPersisted, setPersisted } from './utils'

interface State {
  sheet?: WorkSheet
  sheetName: string
  visits: number
  workbook?: WorkBook
}

const name = 'sheet'
const defaultValue = ''
const visitsName = 'sheetVisits'
const defaultVisits = 1

const update = (state: State) => {
  const { sheetName, visits } = state
  setPersisted(name, sheetName)
  setPersisted(visitsName, visits.toString())
  return state
}

const initialState: State = {
  sheetName: getPersisted(name, defaultValue),
  visits: parseInt(getPersisted(visitsName, defaultVisits.toString())),
}

export const getWorkbook = createAsyncThunk(
  `${name}/getWorkbook`,
  async ({ file }: { file: File }) => {
    workbookWorker.postMessage({ file, method: 'get' })

    const {
      data: { workbook },
    } = await promisifyListener('message', workbookWorker)

    return workbook
  },
)

const sheetSlice = createSlice({
  extraReducers: (builder) => {
    builder.addCase(getWorkbook.fulfilled, (state, { payload }) => {
      state.workbook = payload
      state.sheetName ||= payload?.SheetNames[0] ?? defaultValue
      state.sheet = payload?.Sheets[state.sheetName]
      update(state)
    })
  },
  initialState: update(initialState),
  name,
  reducers: {
    deleteWorkbook: (state) => {
      state = { ...initialState }
      state.sheetName = defaultValue
      state.visits = defaultVisits
      return update(state)
    },
    setSheetName: (state, { payload }: PayloadAction<string>) => {
      state.sheetName = payload
      state.sheet = state.workbook?.Sheets[payload]
      update(state)
    },
    setVisits: (state, { payload }: PayloadAction<number>) => {
      state.visits = payload
      update(state)
    },
  },
})

export const { deleteWorkbook, setSheetName, setVisits } = sheetSlice.actions
export default sheetSlice.reducer
