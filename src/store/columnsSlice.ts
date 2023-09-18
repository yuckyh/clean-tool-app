import type { CodebookMatch } from '@/workers/column'
import type { PayloadAction } from '@reduxjs/toolkit'
import type Fuse from 'fuse.js'
import type { WorkSheet } from 'xlsx'

import { columnWorker, promisifyListener } from '@/workers/static'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { utils } from 'xlsx'

import { getPersisted, setPersisted } from './utils'

interface State {
  columnStr: string
  columns: string[]
  matchIndices: number[]
  matches: Fuse.FuseResult<CodebookMatch>[][]
  originalColumnStr: string
  originalColumns: string[]
}

const name = 'columns'
const originalName = 'originalColumns'
const defaultValue = ''
const defaultOriginal = ''
const initialState: State = {
  columnStr: getPersisted(name, defaultValue),
  columns: getPersisted(name, defaultValue).split(','),
  matchIndices: [],
  matches: [],
  originalColumnStr: getPersisted(originalName, defaultOriginal),
  originalColumns: getPersisted(originalName, defaultOriginal).split(','),
}

const update = (state: State) => {
  const { columnStr, columns, matches, originalColumnStr, originalColumns } =
    state
  state.columnStr = columns.join(',')
  setPersisted(name, columnStr)
  state.originalColumnStr = originalColumns.join(',')
  setPersisted(originalName, originalColumnStr)
  state.matchIndices = columns.map(
    (column, i) =>
      matches[i]?.findIndex((match) => match.item.name === column) ?? 0,
  )
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
      const { columnStr, matches } = state
      if (!columnStr) {
        state.columns = matches.map((column) => column[0]?.item.name ?? '')
      }
      update(state)
    })
  },
  initialState: update(initialState),
  name,
  reducers: {
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

export const { setOriginalColumns } = columnsSlice.actions
export default columnsSlice.reducer
