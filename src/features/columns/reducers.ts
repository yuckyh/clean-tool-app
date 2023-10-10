import type { PayloadAction } from '@reduxjs/toolkit'

import { getPersisted, setPersisted } from '@/lib/utils'
import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'

import { fetchMatches, name } from './actions'

interface ColumnMatch {
  match: string
  score: number
  pos: number
}

interface ColumnMatches {
  matches: ColumnMatch[]
  pos: number
}

interface State {
  matchLists: ColumnMatches[]
  matchColumns: string[]
  matchVisits: number[]
}

const keys = ['matchColumns', 'matchVisits'] as const
const defaultValue = ''

const initialState: State = {
  matchVisits: getPersisted(keys[1], defaultValue)
    .split(',')
    .filter(Boolean)
    .map((visit) => parseInt(visit)),
  matchColumns: getPersisted(keys[0], defaultValue).split(',').filter(Boolean),
  matchLists: [],
}

// Slice
const columnsSlice = createSlice({
  extraReducers: (builder) => {
    builder.addCase(fetchMatches.fulfilled, (state, { payload }) => {
      const { matchColumns, matchVisits } = state

      state.matchLists = payload.map((matches, i) => ({
        matches: matches.map(({ item: { name }, score = 1 }, j) => ({
          match: name,
          pos: j,
          score,
        })),
        pos: i,
      }))

      if (!matchColumns.length) {
        state.matchColumns = payload.map(([match]) => match?.item.name ?? '')
      }

      if (!matchVisits.length) {
        state.matchVisits = state.matchColumns
          .map((match, i) => [match, i] as const) // Save the original index
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
      _.zip(keys, [matchColumns, matchVisits]).forEach(
        ([key = '', val = []]) => {
          setPersisted(key, val.join(','))
        },
      )
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
      state = { ...initialState }
      state.matchColumns = []
      state.matchVisits = []
      state.matchLists = []

      return state
    },
  },
  initialState,
  name,
})

export const { saveColumnState, setMatchColumn, deleteColumns, setMatchVisit } =
  columnsSlice.actions
export default columnsSlice.reducer
