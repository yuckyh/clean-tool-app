/* eslint-disable
  no-param-reassign,
  functional/immutable-data
*/
import type { PayloadAction } from '@reduxjs/toolkit'
import type * as Ref from 'fp-ts/Refinement'

import { codebook } from '@/data'
import { arrayLookup, getIndexedValue } from '@/lib/array'
import { equals, stubOrd } from '@/lib/fp'
import { dump } from '@/lib/fp/logger'
import { getPersisted, setPersisted } from '@/lib/localStorage'
import { createSlice } from '@reduxjs/toolkit'
import * as O from 'fp-ts/Option'
import * as Ord from 'fp-ts/Ord'
import * as P from 'fp-ts/Predicate'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'
import * as N from 'fp-ts/number'
import * as S from 'fp-ts/string'

import { fetchMatches, sliceName } from './actions'

export type DataType = 'categorical' | 'none' | 'numerical'

interface State {
  dataTypes: readonly DataType[]
  matchColumns: readonly string[]
  matchVisits: readonly number[]
  matchesList: readonly (readonly string[])[]
  scoresList: readonly (readonly number[])[]
}

const keys = ['matchColumns', 'matchVisits', 'dataTypes'] as const
const defaultValue = ''

const isDataType: Ref.Refinement<string, DataType> = (x): x is DataType =>
  x === 'categorical' || x === 'numerical'

const initialState: Readonly<State> = {
  dataTypes: f.pipe(
    getPersisted(keys[2], defaultValue),
    S.split(','),
    RA.filter(P.not(S.isEmpty)),
    RA.filter(isDataType),
  ),
  matchColumns: f.pipe(
    getPersisted(keys[0], defaultValue),
    S.split(','),
    RA.filter(P.not(S.isEmpty)),
  ),
  matchVisits: f.pipe(
    getPersisted(keys[1], defaultValue),
    S.split(','),
    RA.filter(P.not(S.isEmpty)),
    RA.map(
      f.flow((value) => [value, 10] as [string, number], f.tupled(parseInt)),
    ),
  ),
  matchesList: RA.empty,
  scoresList: RA.empty,
}

// Slice
const columnsSlice = createSlice({
  extraReducers: (builder) => {
    builder.addCase(fetchMatches.fulfilled, (state, { payload }) => {
      const { dataTypes: dataType, matchColumns, matchVisits } = state

      const matchesList = f.pipe(
        payload,
        RA.map(RA.map(({ item: { name } }) => name)),
      )

      state.matchesList = matchesList as string[][]

      state.scoresList = f.pipe(
        payload,
        RA.map(RA.map(({ score = 0 }) => score)),
      ) as number[][]

      state.matchColumns = matchColumns.length
        ? matchColumns
        : (f.pipe(
            matchesList,
            RA.map(
              f.flow(
                RA.head,
                O.getOrElse(() => ''),
              ),
            ),
          ) as string[])

      const sorted =
        !matchVisits.length &&
        f.pipe(
          [...state.matchColumns],
          RA.mapWithIndex((i, x) => [i, x] as const),
          RA.sort(Ord.tuple(stubOrd(), S.Ord)),
        )

      state.matchVisits = !sorted
        ? matchVisits
        : (f.pipe(
            sorted,
            RA.mapWithIndex(
              f.flow(
                (sortedIdx, [originalIdx, x]) =>
                  [originalIdx, sortedIdx, x] as const,
                ([originalIdx, sortedIdx, x]) =>
                  [
                    originalIdx,
                    arrayLookup(sorted)([sortedIdx - 1, ''])(sortedIdx - 1)[1],
                    arrayLookup(sorted)([sortedIdx - 2, ''])(sortedIdx - 2)[1],
                    x,
                  ] as const,
                ([originalIdx, prevMatch, prevPrevMatch, x]) =>
                  [
                    originalIdx,
                    Number(equals(S.Eq)(x)(prevMatch)),
                    Number(equals(S.Eq)(prevMatch)(prevPrevMatch)),
                  ] as const,
                ([originalIdx, increment, prevIncrement]) =>
                  [
                    originalIdx,
                    increment + (increment === 1 ? prevIncrement : 0),
                  ] as const,
              ),
            ),
            RA.sort(Ord.tuple(N.Ord, stubOrd())),
            RA.map(getIndexedValue),
          ) as number[])

      state.dataTypes = dataType.length
        ? dataType
        : (f.pipe(
            matchColumns,
            RA.map((matchColumn) =>
              f.pipe(
                codebook,
                RA.findFirst(({ name }) => equals(S.Eq)(name)(matchColumn)),
                O.map(({ type }) => type),
                O.getOrElse(() => 'none'),
                equals(S.Eq),
                RA.some,
                f.apply(['whole_number', 'interval'] as const),
                (isNumerical) => (isNumerical ? 'numerical' : 'categorical'),
              ),
            ),
          ) as DataType[])

      return state
    })
  },
  initialState,
  name: sliceName,
  reducers: {
    deleteColumns: (state) => {
      state.matchColumns = []
      state.matchVisits = []
      state.matchesList = []
      state.scoresList = []
      state.dataTypes = []

      return state
    },
    saveColumnState: (state) => {
      const { dataTypes, matchColumns, matchVisits } = state

      f.pipe(
        [matchColumns, matchVisits, dataTypes] as const,
        RA.zip(keys),
        RA.map(([value, key]) => {
          return setPersisted(key, value.join(','))
        }),
      )

      return state
    },
    setDataType: (
      state,
      {
        payload,
      }: Readonly<
        PayloadAction<{
          dataType: DataType
          pos: number
        }>
      >,
    ) => {
      const { dataType, pos } = payload

      state.dataTypes[pos] = dataType

      return state
    },
    setMatchColumn: (
      state,
      {
        payload,
      }: Readonly<PayloadAction<{ matchColumn: string; pos: number }>>,
    ) => {
      const { matchColumn, pos } = payload

      state.matchColumns[pos] = matchColumn

      return state
    },
    setMatchVisit: (
      state,
      { payload }: Readonly<PayloadAction<{ matchVisit: number; pos: number }>>,
    ) => {
      const { matchVisit, pos } = payload

      state.matchVisits[pos] = matchVisit

      return state
    },
  },
})

export const {
  deleteColumns,
  saveColumnState,
  setDataType,
  setMatchColumn,
  setMatchVisit,
} = columnsSlice.actions
export default columnsSlice.reducer
