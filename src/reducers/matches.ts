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

import { sliceName } from '@/actions/data'
import { fetchMatches } from '@/actions/matches'
import { codebook } from '@/data'
import { arrayLookup, findIndex, getIndexedValue, head } from '@/lib/array'
import { equals, isCorrectNumber, typedIdentity } from '@/lib/fp'
import { stubOrd } from '@/lib/fp/Ord'
import { add, multiply } from '@/lib/fp/number'
import { search } from '@/lib/fuse'
import { getPersisted, setPersisted } from '@/lib/localStorage'
import { createSlice } from '@reduxjs/toolkit'
import * as O from 'fp-ts/Option'
import * as Ord from 'fp-ts/Ord'
import * as P from 'fp-ts/Predicate'
import * as RA from 'fp-ts/ReadonlyArray'
import * as B from 'fp-ts/boolean'
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
  scores: readonly string[]
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
        : (RA.map(
            f.flow(head<number>, f.apply(0), multiply(-1), add(1), (x) =>
              x.toFixed(2),
            ),
          )(resultsScores) as string[])

      const sorted =
        !visits.length &&
        f.pipe(
          [...state.columns],
          RA.mapWithIndex((i, x) => [i, x] as const),
          RA.sort(Ord.tuple(stubOrd(), S.Ord)),
        )

      state.visits = !sorted
        ? [...state.visits]
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
            [...state.columns],
            RA.map((matchColumn) =>
              f.pipe(
                codebook,
                RA.findFirst(({ name }) => equals(S.Eq)(name)(matchColumn)),
                O.map(({ type }) => type),
                O.getOrElse(() => ''),
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
      state.scores = []
      state.results = []
      state.resultsScores = []
      state.dataTypes = []

      return state
    },
    saveMatchesState: (state) => {
      const { columns, dataTypes, scores, visits } = state

      f.pipe(
        [columns, visits, scores, dataTypes] as const,
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
    setDataTypeByColumn: (
      state,
      {
        payload,
      }: Readonly<
        PayloadAction<{
          matchColumn: string
          pos: number
          row: readonly string[]
        }>
      >,
    ) => {
      const { matchColumn, pos, row } = payload

      const newDataType: DataType = f.pipe(
        codebook,
        RA.findFirst(({ name }) => equals(S.Eq)(name)(matchColumn)),
        O.map(({ type }) =>
          f.pipe(
            type,
            S.includes,
            RA.some,
          )(['whole_number', 'interval'] as const),
        ),
        O.getOrElse(
          () =>
            0.6 * row.length < f.pipe(row, RA.filter(isCorrectNumber)).length,
        ),
        B.match(
          () => 'categorical',
          () => 'numerical',
        ),
      )

      state.dataTypes[pos] = newDataType

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
    setMatchScore: (
      state,
      { payload }: Readonly<PayloadAction<{ matchScore: string; pos: number }>>,
    ) => {
      const { matchScore, pos } = payload

      state.scores[pos] = matchScore

      return state
    },
    setMatchScoreByColumn: (
      state,
      {
        payload,
      }: Readonly<PayloadAction<{ matchColumn: string; pos: number }>>,
    ) => {
      const { matchColumn, pos } = payload

      const { results, resultsScores } = state

      const result = arrayLookup([
        ...results,
      ] as readonly (readonly string[])[])([] as readonly string[])(pos)

      const resultScores = arrayLookup([
        ...resultsScores,
      ] as readonly (readonly number[])[])([] as readonly number[])(pos)

      const newScore = f.pipe(
        matchColumn,
        findIndex([...result])(S.Eq),
        arrayLookup(resultScores)(
          f.pipe(
            matchColumn,
            search,
            RA.head,
            O.flatMap(({ score }) => O.fromNullable(score)),
            O.getOrElse(() => 0),
          ),
        ),
        multiply(-1),
        add(1),
        (x) => x.toFixed(2),
      )

      state.scores[pos] = newScore

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
  setDataTypeByColumn,
  setMatchColumn,
  setMatchScore,
  setMatchScoreByColumn,
  setMatchVisit,
} = actions
export default reducer
