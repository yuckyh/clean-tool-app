/* eslint-disable functional/prefer-immutable-types */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'
import { type BookType, utils } from 'xlsx'

import { constant, pipe } from 'fp-ts/function'
import * as Str from 'fp-ts/string'
import { fromNullable, getOrElse, isNone } from 'fp-ts/Option'
import type { ReadonlyNonEmptyArray } from 'fp-ts/ReadonlyNonEmptyArray'
import {
  filter,
  makeBy,
  getEq,
  uniq,
  map,
  of,
} from 'fp-ts/ReadonlyNonEmptyArray'
import { findIndex, deleteAt, insertAt, append } from 'fp-ts/ReadonlyArray'
import { deleteSheet, fetchSheet, sliceName, postFile } from './actions'
import { getPersisted, setPersisted } from '@/lib/localStorage'

type FlagReason = 'incorrect' | 'missing' | 'outlier'

interface State {
  flaggedCells: ReadonlyNonEmptyArray<readonly [string, string, FlagReason]>
  originalColumns: ReadonlyNonEmptyArray<string>
  sheetNames: ReadonlyNonEmptyArray<string>
  visits: ReadonlyNonEmptyArray<string>
  data: ReadonlyNonEmptyArray<CellItem>
  bookType?: BookType
  sheetName: string
  fileName: string
}

const defaultValue = ''
const listKeys = ['sheetNames', 'visits', 'originalColumns'] as const
const fileNameKey = 'fileName'

const initialState: State = {
  flaggedCells: pipe(
    getPersisted('flaggedCells', defaultValue),
    Str.slice(1, -1),
    Str.split('],['),
    filter(Str.isEmpty),
    getOrElse(constant(of(''))),
    map(
      (value) =>
        pipe(
          value,
          Str.split(','),
          filter(Str.isEmpty),
          getOrElse(constant(of(''))),
        ) as readonly [string, string, FlagReason],
    ),
  ),
  originalColumns: pipe(
    getPersisted(listKeys[2], defaultValue),
    Str.split(','),
    filter(Str.isEmpty),
    getOrElse(constant(of(''))),
  ),
  sheetNames: pipe(
    getPersisted(listKeys[0], defaultValue),
    Str.split(','),
    filter(Str.isEmpty),
    getOrElse(constant(of(''))),
  ),
  visits: pipe(
    getPersisted(listKeys[1], defaultValue),
    Str.split(','),
    filter(Str.isEmpty),
    getOrElse(constant(of(''))),
  ),
  data: JSON.parse(
    getPersisted('data', '[]'),
  ) as ReadonlyNonEmptyArray<CellItem>,
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
      ;([sheetNames, visits, originalColumns] as const).forEach((value, i) => {
        setPersisted(listKeys[i] ?? '', value.join(','))

        return undefined
      })

      setPersisted('flaggedCells', `[${flaggedCells.join('],[')}]`)

      return state
    },
    removeFlaggedCell: (
      state,
      { payload }: PayloadAction<[string, string, FlagReason]>,
    ) => {
      state.flaggedCells = pipe(
        state.flaggedCells,
        deleteAt(
          pipe(
            state.flaggedCells,
            findIndex((cell) => getEq(Str.Eq).equals(payload, cell)),
            getOrElse(constant(-1)),
          ),
        ),
        getOrElse(constant(state.flaggedCells)),
      )

      return state
    },
    syncVisits: (state, { payload }: PayloadAction<number>) => {
      const visitsLengthDiff = payload - state.visits.length

      makeBy(() => {
        if (visitsLengthDiff > 0) {
          state.visits.push((state.visits.length + 1).toString())
          return undefined
        }
        state.visits.pop()

        return undefined
      })(visitsLengthDiff)

      return state
    },
    addFlaggedCell: (
      state,
      { payload }: PayloadAction<readonly [string, string, FlagReason]>,
    ) => {
      const shouldAdd = state.flaggedCells.every((cell) =>
        cell.some((value, i) => value !== payload[i]),
      )

      if (shouldAdd) {
        append(payload)(state.flaggedCells)
        return state
      }

      return state
    },
    setVisit: (
      state,
      { payload }: PayloadAction<{ visit: string; pos: number }>,
    ) => {
      const { visit, pos } = payload
      state.visits = pipe(
        state.visits,
        insertAt(pos, visit),
        getOrElse(constant(state.visits)),
        uniq(Str.Eq),
      )

      return state
    },
    setSheetName: (state, { payload }: PayloadAction<string>) => {
      state.sheetName = payload

      return state
    },
    deleteVisits: (state) => {
      state.visits = []

      return state
    },
  },
  // eslint-disable-next-line functional/no-return-void
  extraReducers: (builder) => {
    // eslint-disable-next-line functional/no-expression-statements
    builder
      .addCase(fetchSheet.fulfilled, (state, { payload }) => {
        const { SheetNames, bookType, Sheets } = payload

        if (
          pipe([SheetNames, Sheets, bookType] as const, fromNullable, isNone)
        ) {
          return state
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

        return state
      })
      .addCase(postFile.fulfilled, (state, { payload }) => {
        state.fileName = payload

        return state
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

        return state
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
