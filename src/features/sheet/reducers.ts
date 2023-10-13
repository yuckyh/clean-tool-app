import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'
import { type BookType, utils } from 'xlsx'
import { zip } from 'lodash'
import { just, list } from '@/lib/monads'
import { getPersisted, setPersisted } from '@/lib/localStorage'

import { deleteSheet, fetchSheet, sliceName, postFile } from './actions'
import { range } from '@/lib/array'

type FlagReason = 'incorrect' | 'missing' | 'outlier'

interface State {
  flaggedCells: [string, string, FlagReason][]
  originalColumns: string[]
  sheetNames: string[]
  bookType?: BookType
  sheetName: string
  visits: string[]
  data: CellItem[]
  fileName: string
}

const defaultValue = ''
const listKeys = ['sheetNames', 'visits', 'originalColumns'] as const
const fileNameKey = 'fileName'

const initialState: State = {
  flaggedCells: getPersisted('flaggedCells', defaultValue)
    .slice(1, -1)
    .split('],[')
    .filter(Boolean)
    .map(
      (entry) =>
        entry.split(',').filter(Boolean) as [string, string, FlagReason],
    ),
  originalColumns: getPersisted(listKeys[2], defaultValue)
    .split(',')
    .filter(Boolean),
  sheetNames: getPersisted(listKeys[0], defaultValue)
    .split(',')
    .filter(Boolean),
  visits: getPersisted(listKeys[1], defaultValue).split(',').filter(Boolean),
  data: JSON.parse(getPersisted('data', '[]')) as CellItem[],
  fileName: getPersisted(fileNameKey, defaultValue),
  sheetName: getPersisted(sliceName, defaultValue),
}

const sheetSlice = createSlice({
  reducers: {
    saveSheetState: (state) => {
      const {
        originalColumns,
        flaggedCells,
        sheetNames,
        sheetName,
        fileName,
        visits,
        data,
      } = state

      setPersisted(sliceName, sheetName)
      setPersisted(fileNameKey, fileName)
      setPersisted('data', JSON.stringify(data))

      zip(listKeys, [sheetNames, visits, originalColumns]).forEach(
        ([key = '', value = []]) => {
          setPersisted(key, value.join(','))
        },
      )

      setPersisted('flaggedCells', `[${flaggedCells.join('],[')}]`)
    },
    syncVisits: (state, { payload }: PayloadAction<number>) => {
      const visitsLengthDiff = payload - state.visits.length

      just(visitsLengthDiff)(range).convert(list)(() => {
        if (visitsLengthDiff > 0) {
          state.visits.push((state.visits.length + 1).toString())
        } else {
          state.visits.pop()
        }
      })
    },
    removeFlaggedCell: (
      state,
      { payload }: PayloadAction<[string, string]>,
    ) => {
      const index = state.flaggedCells.findIndex((cell) =>
        cell.every((item) => item === payload[0] || item === payload[1]),
      )

      if (index >= 0) {
        state.flaggedCells.splice(index, 1)
      }
    },
    addFlaggedCell: (
      state,
      { payload }: PayloadAction<[string, string, FlagReason]>,
    ) => {
      const shouldAdd = state.flaggedCells.every((index) =>
        index.some((cell, i) => cell !== payload[i]),
      )

      if (shouldAdd) {
        state.flaggedCells.push(payload)
      }
    },
    setVisit: (
      state,
      { payload }: PayloadAction<{ visit: string; pos: number }>,
    ) => {
      const { visit, pos } = payload
      const visitArr = Array.from(state.visits)
      visitArr[pos] = visit
      state.visits = Array.from(new Set(visitArr))
    },
    setSheetName: (state, { payload }: PayloadAction<string>) => {
      state.sheetName = payload
    },
    deleteVisits: (state) => {
      state.visits = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSheet.fulfilled, (state, { payload }) => {
        const { SheetNames, bookType, Sheets } = payload

        if ([SheetNames, Sheets, bookType].some((item) => !item)) {
          return
        }

        if (!state.sheetName) {
          state.sheetName = SheetNames?.[0] ?? defaultValue
        }

        state.bookType = bookType

        state.data = utils.sheet_to_json(Sheets?.[state.sheetName] ?? {})

        state.originalColumns =
          utils.sheet_to_json<string[]>(Sheets?.[state.sheetName] ?? {}, {
            header: 1,
          })[0] ?? []
      })
      .addCase(postFile.fulfilled, (state, { payload }) => {
        state.fileName = payload
      })
      .addCase(deleteSheet.fulfilled, (state) => {
        state.fileName = defaultValue
        state.sheetName = defaultValue
        state.originalColumns = []
        state.sheetNames = []
        state.data = []
        state.visits = []
        state.flaggedCells = []
        state.bookType = undefined
      })
  },
  name: sliceName,
  initialState,
})

export const {
  removeFlaggedCell,
  saveSheetState,
  addFlaggedCell,
  deleteVisits,
  setSheetName,
  syncVisits,
  setVisit,
} = sheetSlice.actions
export default sheetSlice.reducer
