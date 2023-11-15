/**
 * @file The file contains the reducers for the columns slice.
 * @module features/columns/reducers
 */

/* eslint-disable
  no-param-reassign,
  functional/immutable-data
*/
import type { PayloadAction } from '@reduxjs/toolkit'
import type * as Ref from 'fp-ts/Refinement'

import { codebook } from '@/data'
import { fetchMatches } from '@/features/data/actions'
import { sliceName } from '@/features/sheet/actions'
import { arrayLookup, getIndexedValue, head } from '@/lib/array'
import { equals, typedIdentity } from '@/lib/fp'
import { stubOrd } from '@/lib/fp/Ord'
import { getPersisted, setPersisted } from '@/lib/localStorage'
import { createSlice } from '@reduxjs/toolkit'
import * as O from 'fp-ts/Option'
import * as Ord from 'fp-ts/Ord'
import * as P from 'fp-ts/Predicate'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'
import * as N from 'fp-ts/number'
import * as S from 'fp-ts/string'

/**
 * The data type of the columns
 */
export type DataType = 'categorical' | 'none' | 'numerical'

/**
 * The columns state
 */
interface State {
  /**
   * The columns to match
   */
  columns: readonly string[]
  /**
   * The data types of the columns
   */
  dataTypes: readonly DataType[]
  /**
   * The matches
   */
  results: readonly (readonly string[])[]
  /**
   * The scores of the matches
   */
  resultsScores: readonly (readonly number[])[]
  /**
   * The scores of the matches
   */
  scores: readonly number[]
  /**
   * The visits to match
   */
  visits: readonly number[]
}

const keys = [
  'matchColumns',
  'matchVisits',
  'matchScores',
  'dataTypes',
] as const
const defaultValue = ''

const isDataType: Ref.Refinement<string, DataType> = (x): x is DataType =>
  x === 'categorical' || x === 'numerical'

const initialState: Readonly<State> = {
  columns: f.pipe(
    getPersisted(keys[0], defaultValue),
    S.split(','),
    RA.filter(P.not(S.isEmpty)),
  ),
  dataTypes: f.pipe(
    getPersisted(keys[3], defaultValue),
    S.split(','),
    RA.filter(P.not(S.isEmpty)),
    RA.filter(isDataType),
  ),
  results: RA.empty,
  resultsScores: RA.empty,
  scores: f.pipe(
    getPersisted(keys[2], defaultValue),
    S.split(','),
    RA.filter(P.not(S.isEmpty)),
    RA.map(parseFloat),
  ),
  visits: f.pipe(
    getPersisted(keys[1], defaultValue),
    S.split(','),
    RA.filter(P.not(S.isEmpty)),
    RA.map(parseInt),
  ),
}

const { actions, reducer } = createSlice({
  extraReducers: (builder) => {
    builder.addCase(fetchMatches.fulfilled, (state, { payload }) => {
      const { columns, dataTypes, scores, visits } = state

      const results = f.pipe(
        payload,
        RA.map(RA.map(({ item: { name } }) => name)),
      )

      const resultsScores = f.pipe(
        payload,
        RA.map(RA.map(({ score = 0 }) => score)),
      )

      state.results = results as string[][]

      state.resultsScores = resultsScores as number[][]

      state.columns = columns.length
        ? columns
        : (RA.map(f.flow(head<string>, f.apply('')))(results) as string[])

      state.scores = scores.length
        ? scores
        : (RA.map(f.flow(head<number>, f.apply(0)))(resultsScores) as number[])

      const sorted =
        !visits.length &&
        f.pipe(
          [...state.columns],
          RA.mapWithIndex((i, x) => [i, x] as const),
          RA.sort(Ord.tuple(stubOrd(), S.Ord)),
        )

      state.visits = !sorted
        ? visits
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

      state.dataTypes = dataTypes.length
        ? dataTypes
        : (f.pipe(
            columns,
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
    deleteMatches: (state) => {
      state.columns = []
      state.visits = []
      state.results = []
      state.resultsScores = []
      state.dataTypes = []

      return state
    },
    saveMatchesState: (state) => {
      const {
        columns: matchColumns,
        dataTypes,
        scores: matchScores,
        visits: matchVisits,
      } = state

      f.pipe(
        [matchColumns, matchVisits, matchScores, dataTypes] as const,
        RA.map((x) => x.join(',')),
        RA.zip<string>,
        f.apply(keys),
        typedIdentity<[ArrayElement<typeof keys>, string][]>,
        RA.map(f.tupled(setPersisted)),
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

      state.columns[pos] = matchColumn

      return state
    },
    setMatchVisit: (
      state,
      { payload }: Readonly<PayloadAction<{ matchVisit: number; pos: number }>>,
    ) => {
      const { matchVisit, pos } = payload

      state.visits[pos] = matchVisit

      return state
    },
  },
})

export const {
  deleteMatches,
  saveMatchesState,
  setDataType,
  setMatchColumn,
  setMatchVisit,
} = actions
export default reducer
