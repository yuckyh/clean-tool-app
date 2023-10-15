import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'
import {
  defaultTo,
  parseInt,
  property,
  forEach,
  filter,
  split,
  flow,
  map,
  zip,
  nth,
} from 'lodash/fp'
import { getPersisted, setPersisted } from '@/lib/localStorage'

import { fetchMatches, sliceName } from './actions'
import { makeIndexPair } from '@/lib/array'

export interface ColumnMatch {
  match: string
  score: number
}

interface State {
  matchesList: string[][]
  matchColumns: string[]
  scoresList: number[][]
  matchVisits: number[]
}

const keys = ['matchColumns', 'matchVisits'] as const
const defaultStateValue = ''

const initialState: State = {
  matchVisits: flow(
    split(','),
    filter<string>(Boolean),
    map(parseInt(10)),
  )(getPersisted(keys[1], defaultStateValue)),
  matchColumns: flow(
    split(','),
    filter<string>(Boolean),
  )(getPersisted(keys[0], defaultStateValue)),
  matchesList: [],
  scoresList: [],
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
    })
  },
  reducers: {
    saveColumnState: (state) => {
      const { matchColumns, matchVisits } = state

      forEach(([key = '', val = []]) => {
        setPersisted(key, val.join(','))
      })(zip(keys)([matchColumns, matchVisits] as const))
    },
    setMatchColumn: (
      state,
      { payload }: PayloadAction<{ matchColumn: string; pos: number }>,
    ) => {
      const { matchColumn, pos } = payload

      state.matchColumns[pos] = matchColumn
    },
    setMatchVisit: (
      state,
      { payload }: PayloadAction<{ matchVisit: number; pos: number }>,
    ) => {
      const { matchVisit, pos } = payload

      state.matchVisits[pos] = matchVisit
    },
    deleteColumns: (state) => {
      state.matchColumns = []
      state.matchVisits = []
      state.matchesList = []
      state.scoresList = []
    },
  },
  name: sliceName,
  initialState,
})

export const { saveColumnState, setMatchColumn, deleteColumns, setMatchVisit } =
  columnsSlice.actions
export default columnsSlice.reducer
