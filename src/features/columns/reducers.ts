import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'
import { zip } from 'lodash'
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
const defaultValue = ''

const initialState: State = {
  matchVisits: getPersisted(keys[1], defaultValue)
    .split(',')
    .filter(Boolean)
    .map((visit) => parseInt(visit, 10)),
  matchColumns: getPersisted(keys[0], defaultValue).split(',').filter(Boolean),
  matchesList: [],
  scoresList: [],
}

// Slice
const columnsSlice = createSlice({
  extraReducers: (builder) => {
    builder.addCase(fetchMatches.fulfilled, (state, { payload }) => {
      const { matchColumns, matchVisits } = state

      state.matchesList = payload.map((matches) =>
        matches.map(({ item: { name } }) => name),
      )

      state.scoresList = payload.map((matches) =>
        matches.map(({ score = 0 }) => score),
      )

      if (!matchColumns.length) {
        state.matchColumns = payload.map(([match]) => match?.item.name ?? '')
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
          .map(([increment]) => increment) // Remove the original index
      }
    })
  },
  reducers: {
    saveColumnState: (state) => {
      const { matchColumns, matchVisits } = state
      zip(keys, [matchColumns, matchVisits]).forEach(([key = '', val = []]) => {
        setPersisted(key, val.join(','))
      })
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
