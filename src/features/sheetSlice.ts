import type { RootState } from '@/app/store'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { BookType, WorkSheet } from 'xlsx'

import { sheetWorker } from '@/app/workers'
import { toObject } from '@/lib/array'
import {
  curry,
  getPersisted,
  just,
  promisedWorker,
  setPersisted,
} from '@/lib/utils'
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import { utils } from 'xlsx'

import { getFormattedColumns } from './columnsSlice'

interface State {
  bookType: BookType
  fileName: string
  sheetName: string
  sheetNames: string[]
  sheets?: Record<string, WorkSheet>
  visits: number
}

const name = 'sheet'
const defaultValue = ''
const fileNameKey = 'fileName'
const visitsKey = 'sheetVisits'
const defaultVisits = 1

const update = (state: State) => {
  const { fileName, sheetName, visits } = state

  setPersisted(name, sheetName)
  setPersisted(fileNameKey, fileName)
  setPersisted(visitsKey, visits.toString())
  return state
}

const messagePromise = () => promisedWorker('message', sheetWorker)

const initialState: State = {
  bookType: 'xlsx',
  fileName: getPersisted(fileNameKey, defaultValue),
  sheetName: getPersisted(name, defaultValue),
  sheetNames: [],
  visits: just(defaultVisits.toString())(
    curry(getPersisted<string>)(visitsKey),
  )(parseInt)(),
}
export const fetchWorkbook = createAsyncThunk(
  `${name}/fetchWorkbook`,
  async (fileName: string) => {
    sheetWorker.postMessage({ fileName, method: 'get' })

    const { workbook } = (await messagePromise()).data

    return {
      SheetNames: workbook?.SheetNames,
      Sheets: workbook?.Sheets,
    }
  },
)

export const postFile = createAsyncThunk(
  `${name}/postFile`,
  async ({ file }: { file: File }) => {
    const buffer = await file.arrayBuffer()

    sheetWorker.postMessage(
      {
        file,
        fileName: file.name,
        method: 'postFile',
      },
      [buffer],
    )

    return (await messagePromise()).data.fileName
  },
)

export const postFormattedJSON = createAsyncThunk(
  `${name}/postFormattedJSON`,
  async ({
    fileName,
    formattedData,
    sheetName,
  }: {
    fileName: string
    formattedData: CellItem[]
    sheetName: string
  }) => {
    const formattedSheet = utils.json_to_sheet(formattedData)
    const workbook = utils.book_new()
    utils.book_append_sheet(workbook, formattedSheet, sheetName)

    sheetWorker.postMessage({ fileName, method: 'postFormattedJSON', workbook })

    return (await messagePromise()).data
  },
)

export const deleteWorkbook = createAsyncThunk(
  `${name}/deleteWorkbook`,
  async (_, { getState }) => {
    const { fileName } = (getState() as RootState).sheet
    sheetWorker.postMessage({ fileName, method: 'remove' })

    await promisedWorker('message', sheetWorker)
  },
)

// Selectors

const getSheetName = ({ sheet }: RootState) => sheet.sheetName
const getSheets = ({ sheet }: RootState) => sheet.sheets

const getSheet = createSelector(
  [getSheetName, getSheets],
  (sheetName, sheets) => sheets?.[sheetName],
)

export const getData = createSelector([getSheet], (sheet = {}) =>
  utils.sheet_to_json<CellItem>(sheet),
)

export const getOriginalColumns = createSelector([getData], ([data]) =>
  just(data ?? {})(Object.keys)(),
)

export const getFormattedData = createSelector(
  [getData, getFormattedColumns, getOriginalColumns],
  (data, formattedColumns, originalColumns) =>
    data.map((item: CellItem) =>
      toObject(formattedColumns, (i) => item[originalColumns[i] ?? ''] ?? ''),
    ),
)

// Slice
const sheetSlice = createSlice({
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkbook.fulfilled, (state, { payload }) => {
        state.sheets = payload.Sheets
        state.sheetNames = payload.SheetNames ?? []
        state.sheetName ||= payload.SheetNames?.[0] ?? defaultValue
        update(state)
      })
      .addCase(postFile.fulfilled, (state, { payload }) => {
        state.fileName = payload
        update(state)
      })
      .addCase(deleteWorkbook.fulfilled, (state) => {
        state = { ...initialState }
        state.fileName = defaultValue
        state.sheetName = defaultValue
        state.visits = defaultVisits
        return update(state)
      })
  },
  initialState: update(initialState),
  name,
  reducers: {
    setSheetName: (state, { payload }: PayloadAction<string>) => {
      state.sheetName = payload
      update(state)
    },
    setVisits: (state, { payload }: PayloadAction<number>) => {
      state.visits = payload
      update(state)
    },
  },
})

export const { setSheetName, setVisits } = sheetSlice.actions
export default sheetSlice.reducer
