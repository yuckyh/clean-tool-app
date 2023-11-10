/* eslint-disable
  no-param-reassign,
  functional/immutable-data
*/
import type { RejectedAction } from '@/types/redux'
import type { PayloadAction } from '@reduxjs/toolkit'

import { head } from '@/lib/array'
import { equals, typedIdentity } from '@/lib/fp'
import * as CellItem from '@/lib/fp/CellItem'
import * as Flag from '@/lib/fp/Flag'
import { dumpError } from '@/lib/fp/logger'
import { lt } from '@/lib/fp/number'
import { getPersisted, setPersisted } from '@/lib/localStorage'
import { createSlice } from '@reduxjs/toolkit'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import * as P from 'fp-ts/Predicate'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'
import * as S from 'fp-ts/string'
import { type BookType, utils } from 'xlsx'

import { deleteSheet, fetchSheet, postFile, sliceName } from './actions'

// export type Flag = readonly [string, string, FlagReason]

/**
 * The state struct for the sheet slice.
 *
 * This typically contains the information for the sheet.
 * @see {@link sheetSlice}
 */
export interface State {
  /**
   * The type of the workbook. This determines whether to show the sheet picker input in the case of using a csv file.
   */
  bookType?: BookType
  /**
   * The data from the selected sheet. The data is a list of records with keys as the column names.
   */
  data: readonly CellItem.CellItem[]
  /**
   * The name of the file.
   */
  fileName: string
  /**
   * The list of flagged cells.
   */
  flaggedCells: readonly Flag.Flag[]
  /**
   * The list of original column names.
   */
  originalColumns: readonly string[]
  /**
   * The name of the selected sheet.
   */
  sheetName: string
  sheetNames: readonly string[]
  visits: readonly string[]
}

const defaultValue = ''
const listKeys = ['sheetNames', 'visits', 'originalColumns'] as const
const fileNameKey = 'fileName'

const initialState: Readonly<State> = {
  data: f.pipe(
    JSON.parse(
      getPersisted('data', '[]'),
    ) as readonly CellItem.CellItem['value'][],
    RA.map(CellItem.of),
  ),
  fileName: getPersisted(fileNameKey, defaultValue),
  flaggedCells: f.pipe(
    getPersisted('flaggedCells', defaultValue),
    S.slice(1, -1),
    S.split('],['),
    RA.map(S.split(',')),
    RA.filter(Flag.isFlagValue),
    RA.map((arg) => Flag.of(...arg)),
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
          RA.some(f.flow(O.fromNullable, O.isNone))([
            SheetNames,
            Sheets,
            bookType,
          ] as const)
        ) {
          return state
        }

        state.bookType = bookType

        state.sheetNames = SheetNames ?? []
        state.sheetName ||= state.sheetNames[0] ?? defaultValue

        state.visits = state.visits.length ? state.visits : ['1']

        const sheet = Sheets?.[state.sheetName] ?? {}

        state.data = f.pipe(
          utils.sheet_to_json<CellItem.CellItem['value']>(sheet),
          RA.map(CellItem.of),
        ) as CellItem.CellItem[]

        state.originalColumns = f.pipe(
          utils.sheet_to_json<string[]>(sheet, {
            header: 1,
          }),
          head,
          f.apply([]),
        )

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
        (action: Readonly<RejectedAction>) => action.type.endsWith('rejected'),
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
      setPersisted(
        'data',
        f.pipe(CellItem.unwrap, RA.map, f.apply(data), JSON.stringify),
      )

      f.pipe(
        [sheetNames, visits, originalColumns] as const,
        RA.map((x) => x.join(',')),
        RA.zip(listKeys),
        typedIdentity<[string, string][]>,
        RA.map(f.tupled(setPersisted)),
      )

      setPersisted('flaggedCells', `[${flaggedCells.join('],[')}]`)

      return state
    },
    setSheetName: (state, { payload }: Readonly<PayloadAction<string>>) => {
      state.sheetName = payload

      return state
    },
    setVisit: (
      state,
      { payload }: Readonly<PayloadAction<{ pos: number; visit: string }>>,
    ) => {
      const { pos, visit } = payload
      const visits = [...state.visits] as readonly string[]

      state.visits = f.pipe(
        visits,
        RA.modifyAt(pos, f.constant(visit)),
        O.getOrElse(() => visits),
      ) as string[]

      return state
    },
    syncFlaggedCells: (
      state,
      { payload }: Readonly<PayloadAction<Flag.Flag>>,
    ) => {
      state.flaggedCells = f.pipe(
        [...state.flaggedCells],
        E.fromPredicate(RA.elem(Flag.Eq)(payload), f.identity),
        E.match(
          f.pipe(equals(Flag.Eq)(payload), P.not, RA.filter<Flag.Flag>),
          RA.append(payload),
        ),
      ) as typeof state.flaggedCells

      return state
    },
    syncVisits: (state, { payload }: Readonly<PayloadAction<number>>) => {
      const visitsLengthDiff = payload - state.visits.length

      state.visits = f.pipe(
        visitsLengthDiff,
        E.fromPredicate(lt(0), f.identity),
        E.match(f.flow(Math.abs, RA.dropRight), (diff) =>
          f.pipe(
            RA.makeBy(diff, (i) => (i + 1 + state.visits.length).toString()),
            RA.concat,
          ),
        ),
      )([...state.visits]) as string[]

      return state
    },
  },
})

export const {
  deleteVisits,
  saveSheetState,
  setSheetName,
  setVisit,
  syncFlaggedCells,
  syncVisits,
} = sheetSlice.actions
export default sheetSlice.reducer
