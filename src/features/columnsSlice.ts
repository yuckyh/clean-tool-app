import type { RootState } from '@/app/store'
import type { PayloadAction } from '@reduxjs/toolkit'

import { columnWorker } from '@/app/workers'
import { codebook } from '@/data'
import { transpose } from '@/lib/array'
import { getPersisted, promisedWorker, setPersisted } from '@/lib/utils'
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'

export interface ColumnNameData {
  index: number
  matches: string[]
  readonly pos: number
  refIndices: number[]
  scores: number[]
}

interface State {
  matchLists: ColumnNameData[]
  matchRefs: number[]
  matchVisits: number[]
}

const name = 'columns'
const keys = ['matchRefs', 'matchVisits']
const defaultValue = ''
const initialState: State = {
  matchLists: [],
  matchRefs: getPersisted(keys[0], defaultValue)
    .split(',')
    .filter(Boolean)
    .map((ref) => parseInt(ref)),
  matchVisits: getPersisted(keys[1], defaultValue)
    .split(',')
    .filter(Boolean)
    .map((visit) => parseInt(visit)),
}

const update = (state: State) => {
  const { matchLists, matchRefs, matchVisits } = state

  state.matchLists = matchLists.map(({ matches, pos, ...rest }) => ({
    ...rest,
    index: matches.findIndex(
      (match) => match === codebook[matchRefs[pos] ?? 0]?.name,
    ),
    matches,
    pos,
  }))
  ;[matchRefs, matchVisits].forEach((val, i) => {
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
const getMatchRefs = ({ columns }: RootState) => columns.matchRefs

const getMatchVisits = ({ columns }: RootState) => columns.matchVisits

export const getColumns = createSelector([getMatchRefs], (matchRefs) =>
  matchRefs.map((ref) => codebook[ref]?.name ?? ''),
)

const columns = ({ columns }: RootState) =>
  columns.matchRefs.map((ref) => codebook[ref]?.name ?? '')

export const getFormattedColumns = createSelector(
  [columns, getMatchVisits],
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
      const { matchRefs, matchVisits } = state

      state.matchLists = payload.map((matches, i) => ({
        index: 0,
        matches: matches.map(({ item: { name } }) => name),
        pos: i,
        refIndices: matches.map(({ refIndex }) => refIndex),
        scores: matches.map(({ score = 1 }) => score),
      }))

      if (!matchRefs.length) {
        state.matchRefs = payload.map(([match]) => match?.refIndex ?? 0)
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
      state.matchRefs = []
      state.matchVisits = []
      state.matchLists = []
      return update(state)
    },
    setMatchRef: (
      state,
      { payload }: PayloadAction<{ matchRef: number; pos: number }>,
    ) => {
      const { matchRef, pos } = payload
      state.matchRefs[pos] = matchRef

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

export const { deleteColumns, setMatchRef, setMatchVisit } =
  columnsSlice.actions
export default columnsSlice.reducer
