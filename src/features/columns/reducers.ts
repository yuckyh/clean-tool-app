/* eslint-disable no-param-reassign */
/* eslint-disable functional/immutable-data */
import type { PayloadAction } from '@reduxjs/toolkit'

import { getPersisted, setPersisted } from '@/lib/localStorage'
import { createSlice } from '@reduxjs/toolkit'
import * as RA from 'fp-ts/ReadonlyArray'
import { constant, tupled, flow, pipe } from 'fp-ts/function'
import * as S from 'fp-ts/string'

import * as O from 'fp-ts/Option'
import * as P from 'fp-ts/Predicate'
import { fetchMatches, sliceName } from './actions'

export interface ColumnMatch {
  match: string
  score: number
}

interface State {
  matchesList: readonly (readonly string[])[]
  scoresList: readonly (readonly number[])[]
  matchColumns: readonly string[]
  matchVisits: readonly number[]
}

const keys = ['matchColumns', 'matchVisits'] as const
const defaultValue = ''

const initialState: Readonly<State> = {
  matchVisits: pipe(
    getPersisted(keys[1], defaultValue),
    S.split(','),
    RA.filter(P.not(S.isEmpty)),
    RA.map(flow((value) => [value, 10] as [string, number], tupled(parseInt))),
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
      const { matchColumns, matchVisits } = state

      const matchesList = pipe(
        payload,
        RA.map(RA.map(({ item: { name } }) => name)),
      )

      state.matchesList = matchesList as string[][]

      state.scoresList = pipe(
        payload,
        RA.map(RA.map(({ score = 0 }) => score)),
      ) as number[][]

      if (!matchColumns.length) {
        state.matchColumns = pipe(
          matchesList,
          RA.map(flow(RA.head, pipe('', constant, O.getOrElse))),
        ) as string[]

        return state
      }

      if (!matchVisits.length) {
        state.matchVisits =
          // pipe(matchColumns))
          state.matchColumns
            .map((x, i) => [x, i] as const) // Save the original index
            .sort(([a], [b]) => a.localeCompare(b)) // Sort by name to detect duplicates
            .map(([match, i], sortedI, arr) => {
              const [prevMatch] = arr[sortedI - 1] ?? ['', 0]

              return [Number(match === prevMatch), i] as const
            }) // Mark the duplicates with ones
            .map(([increment, i], sortedI, arr) => {
              const [prevIncrement] = arr[sortedI - 1] ?? [0, 0]

              return [
                increment + (increment === 1 ? prevIncrement : 0),
                i,
              ] as const
            }) // Increment the ones to get the visit number
            .sort(([, a], [, b]) => a - b) // Sort by the original index
            .map(([match]) => match) // Remove the original index

        return state
      }

      return state
    })
  },
  reducers: {
    saveColumnState: (state) => {
      const { matchColumns, matchVisits } = state

      pipe(
        [matchColumns, matchVisits] as const,
        RA.zip(keys),
        RA.map(([value, key]) => {
          return setPersisted(key, value.join(','))
        }),
      )

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

      return state
    },
  },
  name: sliceName,
  initialState,
})

export const { saveColumnState, setMatchColumn, deleteColumns, setMatchVisit } =
  columnsSlice.actions
export default columnsSlice.reducer
