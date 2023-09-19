import type { CodebookMatch } from '@/workers/column'
import type { PayloadAction } from '@reduxjs/toolkit'
import type Fuse from 'fuse.js'
import type { WorkSheet } from 'xlsx'

import { columnWorker, promisifyListener } from '@/workers/static'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { utils } from 'xlsx'

import { getPersisted, setPersisted } from './utils'

interface State {
  columns: string[]
  counts: number[]
  formattedColumns: string[]
  matchRefs: number[]
  matchVisits: number[]
  matches: Omit<Fuse.FuseResult<CodebookMatch>, 'matches'>[][]
  originalColumns: string[]
}

const name = 'columns'
const keys: (keyof State)[] = [
  name,
  'matchRefs',
  'matchVisits',
  'originalColumns',
]
const defaultValue = ''
const initialState: State = {
  columns: getPersisted(name, defaultValue).split(',').filter(Boolean),
  counts: [],
  formattedColumns: [],
  matchRefs: getPersisted(keys[1] ?? '', defaultValue)
    .split(',')
    .filter(Boolean)
    .map((ref) => parseInt(ref)),
  matchVisits: getPersisted(keys[2] ?? '', defaultValue)
    .split(',')
    .filter(Boolean)
    .map((visit) => parseInt(visit)),
  matches: [],
  originalColumns: getPersisted(keys[3] ?? '', defaultValue)
    .split(',')
    .filter(Boolean),
}

const update = (state: State) => {
  const { columns, counts, matchRefs, matchVisits, originalColumns } = state

  state.counts = columns.map(
    (column) => columns.filter((check) => check === column).length,
  )

  state.formattedColumns = columns.map((column, i) =>
    (counts[i] ?? 1) > 1 || matchVisits[i] !== 0
      ? `${column}_${matchVisits[i]}`
      : column,
  )

  setPersisted(name, columns.join(','))
  setPersisted(keys[1] ?? '', matchRefs.join(','))
  setPersisted(keys[2] ?? '', matchVisits.join(','))
  setPersisted(keys[3] ?? '', originalColumns.join(','))
  return state
}

export const getMatches = createAsyncThunk(
  `${name}/getMatches`,
  async (originalColumns: string[]) => {
    columnWorker.postMessage({
      columns: originalColumns,
      method: 'get',
    })

    const {
      data: { matches },
    } = await promisifyListener('message', columnWorker)

    return matches
  },
)

const columnsSlice = createSlice({
  extraReducers: (builder) => {
    builder.addCase(getMatches.fulfilled, (state, { payload }) => {
      state.matches = payload
      const { columns, matchRefs, matchVisits, matches } = state
      if (!columns.length) {
        state.columns = matches.map(([column]) => column?.item.name ?? '')
      }

      if (!matchRefs.length) {
        state.matchRefs = matches.map(([match]) => match?.refIndex ?? 0)
      }

      if (!matchVisits.length) {
        state.matchVisits = matches.map(() => 0)
      }
      update(state)
    })
  },
  initialState: update(initialState),
  name,
  reducers: {
    deleteColumns: (state) => {
      state = { ...initialState }
      state.columns = []
      state.matchRefs = []
      state.matchVisits = []
      state.matches = []
      state.originalColumns = []
      return update(state)
    },
    setColumns: (state, { payload }: PayloadAction<string[]>) => {
      state.columns = payload
      update(state)
    },
    setMatchRefs: (state, { payload }: PayloadAction<number[]>) => {
      state.matchRefs = payload
      update(state)
    },
    setMatchVisits: (state, { payload }: PayloadAction<number[]>) => {
      state.matchVisits = payload
      update(state)
    },
    setOriginalColumns: (
      state,
      { payload }: PayloadAction<WorkSheet | undefined>,
    ) => {
      state.originalColumns = Object.keys(
        utils.sheet_to_json(payload ?? {})[0] ?? {},
      )
      update(state)
    },
  },
})

export const {
  deleteColumns,
  setColumns,
  setMatchRefs,
  setMatchVisits,
  setOriginalColumns,
} = columnsSlice.actions
export default columnsSlice.reducer
