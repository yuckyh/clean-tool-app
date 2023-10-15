import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'
import { type BookType, utils } from 'xlsx'
import {
  findIndex,
  isEqual,
  forEach,
  isEmpty,
  negate,
  filter,
  every,
  split,
  some,
  flow,
  zip,
  map,
} from 'lodash/fp'
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
  flaggedCells: flow(
    split('],['),
    filter<string>(negate(isEmpty)),
    map<string, string[]>(flow(split(','), filter(negate(isEmpty)))),
  )(getPersisted('flaggedCells', defaultValue).slice(1, -1)) as [
    string,
    string,
    FlagReason,
  ][],
  originalColumns: flow(
    split(','),
    filter<string>(negate(isEmpty)),
  )(getPersisted(listKeys[2], defaultValue)),
  sheetNames: flow(
    split(','),
    filter<string>(negate(isEmpty)),
  )(getPersisted(listKeys[0], defaultValue)),
  visits: flow(
    split(','),
    filter<string>(negate(isEmpty)),
  )(getPersisted(listKeys[1], defaultValue)),
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

      forEach(([key = '', value = []]) => {
        setPersisted(key, value.join(','))
      })(zip(listKeys)([sheetNames, visits, originalColumns] as const))

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
    addFlaggedCell: (
      state,
      { payload }: PayloadAction<[string, string, FlagReason]>,
    ) => {
      const shouldAdd = every(
        flow(
          zip(payload),
          some(([newCell, cell]) => cell !== newCell),
        ),
      )(state.flaggedCells)

      if (shouldAdd) {
        state.flaggedCells.push(payload)
      }
    },
    removeFlaggedCell: (
      state,
      { payload }: PayloadAction<[string, string, FlagReason]>,
    ) => {
      const index = findIndex<ArrayElement<typeof state.flaggedCells>>(
        flow(map(isEqual), every(some(payload))),
      )(state.flaggedCells)

      if (index >= 0) {
        state.flaggedCells.splice(index, 1)
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

        if (some(negate)([SheetNames, Sheets, bookType] as const)) {
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
