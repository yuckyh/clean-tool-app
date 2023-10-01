import type { RootState } from '@/app/store'
import type { PayloadAction } from '@reduxjs/toolkit'

import { columnWorker } from '@/app/workers'
import { transpose } from '@/lib/array'
import { getPersisted, promisedWorker, setPersisted } from '@/lib/utils'
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'

export interface ColumnNameData {
  index: number
  matches: string[]
  readonly pos: number
  scores: number[]
}

interface State {
  matchColumns: string[]
  matchLists: ColumnNameData[]
  matchVisits: number[]
}

const name = 'columns' as const
const keys = ['matchColumns', 'matchVisits'] as const
const defaultValue = ''
const initialState: State = {
  matchColumns: getPersisted(keys[0], defaultValue).split(','),
  matchLists: [],
  matchVisits: getPersisted(keys[1], defaultValue)
    .split(',')
    .filter(Boolean)
    .map((visit) => parseInt(visit)),
}

const update = (state: State) => {
  const { matchColumns, matchLists, matchVisits } = state

  state.matchLists = matchLists.map(({ matches, pos, ...rest }) => ({
    ...rest,
    index: matches.findIndex((match) => match === matchColumns[pos]),
    matches,
    pos,
  }))
  ;[matchColumns, matchVisits].forEach((val, i) => {
    setPersisted(keys[i], val.join(','))
  })
  return state
}

// Thunks

export const fetchMatches = createAsyncThunk(
  `${name}/fetchMatches`,
  async (originalColumns: string[]) => {
    columnWorker.postMessage({
      columns: originalColumns,
      method: 'get',
    })

    return (await promisedWorker('message', columnWorker)).data.matches
  },
)

// Selectors
const getMatchVisits = ({ columns }: RootState) => columns.matchVisits

const getColumns = ({ columns }: RootState) => columns.matchColumns

export const getFormattedColumns = createSelector(
  [getColumns, getMatchVisits],
  (columns, matchVisits) =>
    transpose<[string[], number[]]>([columns, matchVisits]).map(
      ([column, matchVisit]) =>
        columns.filter((check) => column === check).length > 1 ||
        matchVisit !== 0
          ? `${column}_${matchVisit}`
          : column,
    ),
)

// Slice
const columnsSlice = createSlice({
  extraReducers: (builder) => {
    builder.addCase(fetchMatches.fulfilled, (state, { payload }) => {
      const { matchColumns, matchVisits } = state

      state.matchLists = payload.map((matches, i) => ({
        index: 0,
        matches: matches.map(({ item: { name } }) => name),
        pos: i,
        scores: matches.map(({ score = 1 }) => score),
      }))

      if (!matchColumns.length) {
        state.matchColumns = payload.map(([match]) => match?.item.name ?? '')
      }

      if (!matchVisits.length) {
        state.matchVisits = payload.map(() => 0)
      }
      update(state)
    })
  },
  initialState: update(initialState),
  name,
  reducers: {
    deleteColumns: (state) => {
      state = { ...initialState }
      state.matchColumns = []
      state.matchVisits = []
      state.matchLists = []
      return update(state)
    },
    setMatchColumns: (
      state,
      { payload }: PayloadAction<{ matchColumn: string; pos: number }>,
    ) => {
      const { matchColumn, pos } = payload
      state.matchColumns[pos] = matchColumn

      update(state)
    },
    setMatchVisit: (
      state,
      { payload }: PayloadAction<{ matchVisit: number; pos: number }>,
    ) => {
      const { matchVisit, pos } = payload
      state.matchVisits[pos] = matchVisit
      update(state)
    },
  },
})

export const { deleteColumns, setMatchColumns, setMatchVisit } =
  columnsSlice.actions
export default columnsSlice.reducer
