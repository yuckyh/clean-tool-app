import type { PayloadAction } from '@reduxjs/toolkit'

import { getPersisted, setPersisted } from '@/lib/utils'
import { createSlice } from '@reduxjs/toolkit'

export type Progress = 'explored' | 'matched' | 'none' | 'uploaded'

interface State {
  progress: Progress
}

const name = 'progress'
const defaultValue: Progress = 'none'

const initialState: State = {
  progress: getPersisted(name, defaultValue),
}

const update = (state: State) => {
  const { progress } = state
  setPersisted(name, progress)
  return state
}

// Slice

const progressSlice = createSlice({
  initialState: update(initialState),
  name,
  reducers: {
    deleteProgress: (state) => {
      state = { ...initialState }
      state.progress = defaultValue
      return update(state)
    },
    setProgress: (state, { payload }: PayloadAction<Progress>) => {
      state.progress = payload

      update(state)
    },
  },
})

export const { deleteProgress, setProgress } = progressSlice.actions
export default progressSlice.reducer
