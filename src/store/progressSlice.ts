import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'

import { getPersisted, setPersisted } from './utils'

type ProgressValue = 'explored' | 'matched' | 'none' | 'uploaded'

interface State {
  allowedPaths: string[]
  position: number
  progress: ProgressValue
}

const pathList = ['/upload', '/column-matching', '/EDA', '/download']
const values: ProgressValue[] = ['none', 'uploaded', 'matched', 'explored']
const allowedPathLists = values.reduce<
  Partial<Record<ProgressValue, string[]>>
>((prev, curr, i) => {
  prev[curr] = ['/', ...pathList.slice(0, i + 1)]
  return prev
}, {})

const name = 'progress'
const defaultValue = 'none'

const update = (state: State) => {
  const { progress } = state
  setPersisted(name, progress)
  state.allowedPaths = allowedPathLists[progress] ?? []
  return state
}

const initialState: State = {
  allowedPaths: ['/'],
  position: 0,
  progress: getPersisted(name, defaultValue),
}

const progressSlice = createSlice({
  initialState: update(initialState),
  name,
  reducers: {
    deleteProgress: (state) => {
      state = { ...initialState }
      state.progress = defaultValue
      return update(state)
    },
    setPosition: (state, { payload }: PayloadAction<number>) => {
      state.position = payload
      update(state)
    },
    setProgress: (state, { payload }: PayloadAction<ProgressValue>) => {
      state.progress = payload
      update(state)
    },
  },
})

export const { deleteProgress, setPosition, setProgress } =
  progressSlice.actions
export default progressSlice.reducer
