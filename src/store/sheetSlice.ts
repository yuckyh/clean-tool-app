import type { PayloadAction } from '@reduxjs/toolkit'
import type { WorkBook, WorkSheet } from 'xlsx'

import { promisifyListener, workbookWorker } from '@/workers/static'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { setPersisted } from './utils'

interface State {
  sheet?: WorkSheet
  sheetName: string
  workbook?: WorkBook
}

const name = 'sheet'
const defaultValue = ''

const update = (state: State) => {
  const { sheetName } = state
  setPersisted(name, sheetName)
  return state
}

const initialState: State = {
  sheetName: defaultValue,
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
      return update(state)
    },
    setSheetName: (state, { payload }: PayloadAction<string>) => {
      state.sheetName = payload
      state.sheet = state.workbook?.Sheets[payload]
      update(state)
    },
  },
})

export const { deleteWorkbook, setSheetName } = sheetSlice.actions
export default sheetSlice.reducer
