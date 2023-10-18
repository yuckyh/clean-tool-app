/* eslint-disable no-param-reassign */
/* eslint-disable functional/immutable-data */
import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'
import { type BookType, utils } from 'xlsx'

import { constant, flow, pipe } from 'fp-ts/function'
import Str from 'fp-ts/string'
import { filter } from 'fp-ts/ReadonlyNonEmptyArray'
import { fromNullable, getOrElse, isNone, match } from 'fp-ts/Option'
import {
  findIndex,
  deleteAt,
  insertAt,
  makeBy,
  append,
  getEq,
  uniq,
  map,
  of,
} from 'fp-ts/ReadonlyArray'
import { getPersisted, setPersisted } from '@/lib/localStorage'
import { deleteSheet, fetchSheet, sliceName, postFile } from './actions'

type FlagReason = 'incorrect' | 'missing' | 'outlier'

interface State {
  flaggedCells: readonly (readonly [string, string, FlagReason])[]
  originalColumns: readonly string[]
  sheetNames: readonly string[]
  visits: readonly string[]
  data: readonly CellItem[]
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
  data: JSON.parse(getPersisted('data', '[]')) as readonly CellItem[],
  fileName: getPersisted(fileNameKey, defaultValue),
  sheetName: getPersisted(sliceName, defaultValue),
}

const sheetSlice = createSlice({
  reducers: {
    removeFlaggedCell: (
      state,
      { payload }: PayloadAction<readonly [string, string, FlagReason]>,
    ) => {
      const flaggedCells = state.flaggedCells as readonly (typeof payload)[]
      state.flaggedCells = pipe(
        flaggedCells,
        findIndex((cell) => getEq(Str.Eq).equals(payload, cell)),
        match(
          constant(flaggedCells),
          flow(
            deleteAt,
            (fn) => fn(flaggedCells),
            pipe(flaggedCells, constant, getOrElse),
          ),
        ),
      ) as [string, string, FlagReason][]

      return state
    },
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
      })

      setPersisted('flaggedCells', `[${flaggedCells.join('],[')}]`)

      return state
    },
    syncVisits: (state, { payload }: PayloadAction<number>) => {
      const visitsLengthDiff = payload - state.visits.length

      makeBy(visitsLengthDiff, () => {
        if (visitsLengthDiff > 0) {
          state.visits.push((state.visits.length + 1).toString())

          return undefined
        }
        state.visits.pop()

        return undefined
      })

      return state
    },
    setVisit: (
      state,
      { payload }: PayloadAction<{ visit: string; pos: number }>,
    ) => {
      const { visit, pos } = payload
      const visits = state.visits as readonly string[]

      state.visits = pipe(
        visits,
        insertAt(pos, visit),
        getOrElse(constant(visits)),
        uniq(Str.Eq),
      ) as string[]

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
    setSheetName: (state, { payload }: PayloadAction<string>) => {
      state.sheetName = payload

      return state
    },
    deleteVisits: (state) => {
      state.visits = []

      return state
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSheet.fulfilled, (state, { payload }) => {
        const { SheetNames, bookType, Sheets } = payload

        if (
          pipe([SheetNames, Sheets, bookType] as const, fromNullable, isNone)
        ) {
          return state
        }

        state.sheetName = !state.sheetName
          ? state.sheetName
          : SheetNames?.[0] ?? defaultValue

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
