import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'
import {
  type ReadonlyNonEmptyArray,
  filter,
  map,
  zip,
  of,
} from 'fp-ts/ReadonlyNonEmptyArray'
import { constant, pipe } from 'fp-ts/function'
import * as Str from 'fp-ts/string'
import { getOrElse } from 'fp-ts/Option'
import { getPersisted, setPersisted } from '@/lib/localStorage'

import { fetchMatches, sliceName } from './actions'
import { makeIndexPair } from '@/lib/array'

export interface ColumnMatch {
  match: string
  score: number
}

interface State {
  matchesList: ReadonlyNonEmptyArray<ReadonlyNonEmptyArray<string>>
  scoresList: ReadonlyNonEmptyArray<ReadonlyNonEmptyArray<number>>
  matchColumns: ReadonlyNonEmptyArray<string>
  matchVisits: ReadonlyNonEmptyArray<number>
}

const keys = ['matchColumns', 'matchVisits'] as const
const defaultValue = ''

const initialState: State = {
  matchVisits: pipe(
    getPersisted(keys[1], defaultValue),
    Str.split(','),
    filter(Str.isEmpty),
    getOrElse(constant(of(''))),
    map((value) => parseInt(value, 10)),
  ),
  matchColumns: pipe(
    getPersisted(keys[0], defaultValue),
    Str.split(','),
    filter(Str.isEmpty),
    getOrElse(constant(of(''))),
  ),
  matchesList: of(of([])),
  scoresList: of(of([])),
}

// Slice
const columnsSlice = createSlice({
  extraReducers: (builder) => {
    builder.addCase(fetchMatches.fulfilled, (state, { payload }) => {
      const { matchColumns, matchVisits } = state

      type Match = ArrayElement<ArrayElement<typeof payload>>

      state.matchesList = map(
        map<Match, string>(flow(property('item.name'), defaultTo(''))),
      )(payload)

      state.scoresList = map(
        map<Match, number>(flow(property('score'), defaultTo(0))),
      )(payload)

      if (!matchColumns.length) {
        state.matchColumns = map<ArrayElement<typeof payload>, string>(
          flow(nth(0), property('item.name'), defaultTo('')),
        )(payload)
      }

      if (!matchVisits.length) {
        state.matchVisits = state.matchColumns
          .map(makeIndexPair) // Save the original index
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
          .map(nth(0)) // Remove the original index
      }

      return state
    })
  },
  reducers: {
    saveColumnState: (state) => {
      const { matchColumns, matchVisits } = state

      pipe(
        [matchColumns, matchVisits] as const,
        zip(keys),
        map(([value, key]) => {
          setPersisted(key, value.join(','))
        }),
      )

      return state
    },
    setMatchColumn: (
      state,
      { payload }: PayloadAction<{ matchColumn: string; pos: number }>,
    ) => {
      const { matchColumn, pos } = payload

      state.matchColumns[pos] = matchColumn

      return state
    },
    setMatchVisit: (
      state,
      { payload }: PayloadAction<{ matchVisit: number; pos: number }>,
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
