/* eslint-disable no-param-reassign */
/* eslint-disable functional/immutable-data */
import type { PayloadAction } from '@reduxjs/toolkit'

import { getPersisted, setPersisted } from '@/lib/localStorage'
import { createSlice } from '@reduxjs/toolkit'
import * as RA from 'fp-ts/ReadonlyArray'
import { constant, tupled, apply, flow, pipe } from 'fp-ts/function'
import * as S from 'fp-ts/string'
import * as O from 'fp-ts/Option'
import * as P from 'fp-ts/Predicate'
import type { Refinement } from 'fp-ts/Refinement'
import { codebook } from '@/data'
import { strEquals } from '@/lib/fp'
import { fetchMatches, sliceName } from './actions'

export interface ColumnMatch {
  match: string
  score: number
}

export type DataType = 'categorical' | 'numerical'

interface State {
  matchesList: readonly (readonly string[])[]
  scoresList: readonly (readonly number[])[]
  matchColumns: readonly string[]
  matchVisits: readonly number[]
  dataTypes: readonly DataType[]
}

const keys = ['matchColumns', 'matchVisits', 'dataTypes'] as const
const defaultValue = ''

const isDataType: Refinement<string, DataType> = (x): x is DataType =>
  x === 'categorical' || x === 'numerical'

const initialState: Readonly<State> = {
  matchVisits: pipe(
    getPersisted(keys[1], defaultValue),
    S.split(','),
    RA.filter(P.not(S.isEmpty)),
    RA.map(flow((value) => [value, 10] as [string, number], tupled(parseInt))),
  ),
  dataTypes: pipe(
    getPersisted(keys[2], defaultValue),
    S.split(','),
    RA.filter(P.not(S.isEmpty)),
    RA.filter(isDataType),
  ),
  matchColumns: pipe(
    getPersisted(keys[0], defaultValue),
    S.split(','),
    RA.filter(P.not(S.isEmpty)),
  ),
  matchesList: RA.empty,
  scoresList: RA.empty,
}

// Slice
const columnsSlice = createSlice({
  extraReducers: (builder) => {
    builder.addCase(fetchMatches.fulfilled, (state, { payload }) => {
      const { dataTypes: dataType, matchColumns, matchVisits } = state

      const matchesList = pipe(
        payload,
        RA.map(RA.map(({ item: { name } }) => name)),
      )

      state.matchesList = matchesList as string[][]

      state.scoresList = pipe(
        payload,
        RA.map(RA.map(({ score = 0 }) => score)),
      ) as number[][]

      state.matchColumns = matchColumns.length
        ? matchColumns
        : (pipe(
            matchesList,
            RA.map(flow(RA.head, pipe('', constant, O.getOrElse))),
          ) as string[])

      state.matchVisits = matchVisits.length
        ? matchVisits
        : state.matchColumns
            .map((x, i) => [x, i] as const) // Save the original index
            .sort(([a], [b]) => a.localeCompare(b)) // Sort by name to detect duplicates
            .map(([match, i], sortedI, arr) => {
              const prevMatch = arr[sortedI - 1]?.[0] ?? ''
              const prevPrevMatch = arr[sortedI - 2]?.[0] ?? ''
              const prevIncrement = Number(prevMatch === prevPrevMatch)
              const increment = Number(match === prevMatch)

              return [
                increment + (increment === 1 ? prevIncrement : 0),
                i,
              ] as const
            }) // Mark the duplicates with ones
            .sort(([, a], [, b]) => a - b) // Sort by the original index
            .map(([match]) => match) // Remove the original index

      state.dataTypes = dataType.length
        ? dataType
        : (pipe(
            matchColumns,
            RA.map((matchColumn) =>
              pipe(
                codebook,
                RA.findFirst(({ name }) => strEquals(name)(matchColumn)),
                O.map(({ type }) => type),
                pipe('', constant, O.getOrElse),
                strEquals,
                RA.some,
                apply(['whole_number', 'interval'] as const),
                (isNumerical) => (isNumerical ? 'numerical' : 'categorical'),
              ),
            ),
          ) as DataType[])

      return state
    })
  },
  reducers: {
    saveColumnState: (state) => {
      const { matchColumns, matchVisits, dataTypes } = state

      pipe(
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
    deleteColumns: (state) => {
      state.matchColumns = []
      state.matchVisits = []
      state.matchesList = []
      state.scoresList = []
      state.dataTypes = []

      return state
    },
  },
  name: sliceName,
  initialState,
})

export const {
  saveColumnState,
  setMatchColumn,
  deleteColumns,
  setMatchVisit,
  setDataType,
} = columnsSlice.actions
export default columnsSlice.reducer
