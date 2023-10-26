/* eslint-disable no-param-reassign */
import type { AppDispatch } from '@/app/store'
/* eslint-disable functional/immutable-data */
import type { AsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type * as Ref from 'fp-ts/Refinement'

import { FlagEq } from '@/lib/fp'
import { getPersisted, setPersisted } from '@/lib/localStorage'
import { dumpError } from '@/lib/logger'
import { createSlice } from '@reduxjs/toolkit'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import * as P from 'fp-ts/Predicate'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'
import * as S from 'fp-ts/string'
import { type BookType, utils } from 'xlsx'

import { deleteSheet, fetchSheet, postFile, sliceName } from './actions'

export type FlagReason = 'incorrect' | 'missing' | 'outlier' | 'suspected'

export type Flag = readonly [string, string, FlagReason]

interface State {
  bookType?: BookType
  data: readonly CellItem[]
  fileName: string
  flaggedCells: readonly Flag[]
  originalColumns: readonly string[]
  sheetName: string
  sheetNames: readonly string[]
  visits: readonly string[]
}

const defaultValue = ''
const listKeys = ['sheetNames', 'visits', 'originalColumns'] as const
const fileNameKey = 'fileName'

const isFlagReason: Ref.Refinement<string | undefined, FlagReason> = (
  x,
): x is FlagReason =>
  x === 'incorrect' || x === 'missing' || x === 'outlier' || x === 'suspected'

const isFlag: Ref.Refinement<readonly string[], Flag> = (x): x is Flag =>
  x.length === 3 && isFlagReason(x[2])

const initialState: State = {
  data: JSON.parse(getPersisted('data', '[]')) as readonly CellItem[],
  fileName: getPersisted(fileNameKey, defaultValue),
  flaggedCells: f.pipe(
    getPersisted('flaggedCells', defaultValue),
    S.slice(1, -1),
    S.split('],['),
    RA.map(S.split(',')),
    RA.filter(isFlag),
  ),
  originalColumns: f.pipe(
    getPersisted(listKeys[2], defaultValue),
    S.split(','),
    RA.filter(P.not(S.isEmpty)),
  ),
  sheetName: getPersisted(sliceName, defaultValue),
  sheetNames: f.pipe(
    getPersisted(listKeys[0], defaultValue),
    S.split(','),
    RA.filter(P.not(S.isEmpty)),
  ),
  visits: f.pipe(
    getPersisted(listKeys[1], defaultValue),
    S.split(','),
    RA.filter(P.not(S.isEmpty)),
  ),
}

const sheetSlice = createSlice({
  extraReducers: (builder) => {
    builder
      .addCase(fetchSheet.fulfilled, (state, { payload }) => {
        const { SheetNames, Sheets, bookType } = payload

        if (
          f.pipe(
            [SheetNames, Sheets, bookType] as const,
            RA.some(f.flow(O.fromNullable, O.isNone)),
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
  initialState,
  name: sliceName,
  reducers: {
    deleteVisits: (state) => {
      state.visits = []

      return state
    },
    saveSheetState: (state) => {
      const {
        data,
        fileName,
        flaggedCells,
        originalColumns,
        sheetName,
        sheetNames,
        visits,
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
    setSheetName: (state, { payload }: PayloadAction<string>) => {
      state.sheetName = payload

      return state
    },
    setVisit: (
      state,
      { payload }: PayloadAction<{ pos: number; visit: string }>,
    ) => {
      const { pos, visit } = payload
      const visits = state.visits as readonly string[]

      state.visits = f.pipe(
        visits,
        RA.modifyAt(pos, f.constant(visit)),
        f.pipe(visits, f.constant, O.getOrElse),
      ) as string[]

      return state
    },
    syncFlaggedCells: (state, { payload }: PayloadAction<Flag>) => {
      const flaggedCells = state.flaggedCells as readonly Flag[]
      state.flaggedCells = f.pipe(
        [...flaggedCells],
        (cells) =>
          f.pipe(
            cells,
            RA.some((cell) => FlagEq.equals(cell, payload)),
          )
            ? E.left(cells)
            : E.right(cells),
        E.match(
          f.flow(RA.filter((cell) => !FlagEq.equals(cell, payload))),
          RA.append(payload),
        ),
      ) as [string, string, FlagReason][]

      return state
    },
    syncVisits: (state, { payload }: PayloadAction<number>) => {
      const visitsLengthDiff = payload - state.visits.length

      RA.makeBy(Math.abs(visitsLengthDiff), () => {
        state.visits = f.pipe(
          [...state.visits] as const,
          visitsLengthDiff > 0
            ? RA.insertAt(
                state.visits.length,
                (state.visits.length + 1).toString(),
              )
            : RA.deleteAt(state.visits.length - 1),
          f.pipe([...state.visits] as const, f.constant, O.getOrElse),
        ) as string[]
      })

      return state
    },
  },
})

interface AsyncThunkConfig {
  dispatch?: AppDispatch
  extra?: unknown
  fulfilledMeta?: unknown
  pendingMeta?: unknown
  rejectValue?: unknown
  rejectedMeta?: unknown
  serializedErrorType?: unknown
  state?: unknown
}

type GenericAsyncThunk = AsyncThunk<unknown, unknown, AsyncThunkConfig>
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>

export const {
  deleteVisits,
  saveSheetState,
  setSheetName,
  setVisit,
  syncFlaggedCells,
  syncVisits,
} = sheetSlice.actions
export default sheetSlice.reducer
