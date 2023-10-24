/* eslint-disable no-param-reassign */
/* eslint-disable functional/immutable-data */
import type { PayloadAction, AsyncThunk } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'
import { type BookType, utils } from 'xlsx'

import { constant, flow, pipe } from 'fp-ts/function'
import * as S from 'fp-ts/string'
import * as O from 'fp-ts/Option'
import * as E from 'fp-ts/Either'
import * as RA from 'fp-ts/ReadonlyArray'
import * as P from 'fp-ts/Predicate'
import { getPersisted, setPersisted } from '@/lib/localStorage'
import { dumpError, dump } from '@/lib/logger'
import type { AppDispatch } from '@/app/store'
import type { Refinement } from 'fp-ts/Refinement'
import { deleteSheet, fetchSheet, sliceName, postFile } from './actions'
import { FlagEq } from './selectors'

export type FlagReason = 'incorrect' | 'missing' | 'general'

export type Flag = readonly [string, string, FlagReason]

interface State {
  originalColumns: readonly string[]
  flaggedCells: readonly Flag[]
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

const isFlagReason: Refinement<undefined | string, FlagReason> = (
  x,
): x is FlagReason => x === 'incorrect' || x === 'missing' || x === 'general'

const isFlag: Refinement<readonly string[], Flag> = (x): x is Flag =>
  x.length === 3 && isFlagReason(x[2])

const initialState: State = {
  flaggedCells: pipe(
    getPersisted('flaggedCells', defaultValue),
    S.slice(1, -1),
    S.split('],['),
    // RA.filter(P.not(S.isEmpty)),
    // RA.map(flow(S.split(','), RA.filter(P.not(S.isEmpty)))),
    RA.map(S.split(',')),
    RA.filter(isFlag),
  ),
  originalColumns: pipe(
    getPersisted(listKeys[2], defaultValue),
    S.split(','),
    RA.filter(P.not(S.isEmpty)),
  ),
  sheetNames: pipe(
    getPersisted(listKeys[0], defaultValue),
    S.split(','),
    RA.filter(P.not(S.isEmpty)),
  ),
  visits: pipe(
    getPersisted(listKeys[1], defaultValue),
    S.split(','),
    RA.filter(P.not(S.isEmpty)),
  ),
  data: JSON.parse(getPersisted('data', '[]')) as readonly CellItem[],
  fileName: getPersisted(fileNameKey, defaultValue),
  sheetName: getPersisted(sliceName, defaultValue),
}

const sheetSlice = createSlice({
  reducers: {
    syncVisits: (state, { payload }: PayloadAction<number>) => {
      const visitsLengthDiff = payload - state.visits.length

      RA.makeBy(Math.abs(visitsLengthDiff), () => {
        state.visits = pipe(
          [...state.visits] as const,
          visitsLengthDiff > 0
            ? RA.insertAt(
                state.visits.length,
                (state.visits.length + 1).toString(),
              )
            : RA.deleteAt(state.visits.length - 1),
          pipe([...state.visits] as const, constant, O.getOrElse),
        ) as string[]
      })

      return state
    },
    syncFlaggedCells: (state, { payload }: PayloadAction<Flag>) => {
      const flaggedCells = state.flaggedCells as readonly Flag[]
      state.flaggedCells = pipe(
        [...flaggedCells],
        (cells) =>
          pipe(
            cells,
            RA.some((cell) => FlagEq.equals(cell, payload)),
          )
            ? E.left(cells)
            : E.right(cells),
        E.match(
          flow(RA.filter((cell) => !FlagEq.equals(cell, payload))),
          RA.append(payload),
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
    setVisit: (
      state,
      { payload }: PayloadAction<{ visit: string; pos: number }>,
    ) => {
      const { visit, pos } = payload
      const visits = state.visits as readonly string[]

      state.visits = pipe(
        visits,
        RA.modifyAt(pos, constant(visit)),
        pipe(visits, constant, O.getOrElse),
        dump,
      ) as string[]

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
          pipe(
            [SheetNames, Sheets, bookType] as const,
            RA.some(flow(O.fromNullable, O.isNone)),
          )
        ) {
          return state
        }

        state.sheetName ||= SheetNames?.[0] ?? defaultValue

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
      .addMatcher<RejectedAction>(
        (action: RejectedAction) => action.type.endsWith('rejected'),
        (state, action) => {
          dumpError(action)
          return state
        },
      )
  },
  name: sliceName,
  initialState,
})

interface AsyncThunkConfig {
  serializedErrorType?: unknown
  fulfilledMeta?: unknown
  rejectedMeta?: unknown
  dispatch?: AppDispatch
  rejectValue?: unknown
  pendingMeta?: unknown
  state?: unknown
  extra?: unknown
}

type GenericAsyncThunk = AsyncThunk<unknown, unknown, AsyncThunkConfig>
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>

export const {
  syncFlaggedCells,
  saveSheetState,
  deleteVisits,
  setSheetName,
  syncVisits,
  setVisit,
} = sheetSlice.actions
export default sheetSlice.reducer
