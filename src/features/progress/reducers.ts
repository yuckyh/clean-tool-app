import type { PayloadAction } from '@reduxjs/toolkit'

import { getPersisted, setPersisted } from '@/lib/utils'
import { createSlice } from '@reduxjs/toolkit'

export type Progress = 'explored' | 'uploaded' | 'matched' | 'none'

interface State {
  progress: Progress
}

const name = 'progress'
const defaultValue: Progress = 'none'

const initialState: State = {
  progress: getPersisted(name, defaultValue),
}

// Slice
const progressSlice = createSlice({
  reducers: {
    deleteProgress: (state) => {
      state = { ...initialState }
      state.progress = defaultValue

      return state
    },
    saveProgressState: (state) => {
      const { progress } = state

      setPersisted(name, progress)
    },
    setProgress: (state, { payload }: PayloadAction<Progress>) => {
      state.progress = payload
    },
  },
  initialState,
  name,
})

export const { saveProgressState, deleteProgress, setProgress } =
  progressSlice.actions
export default progressSlice.reducer
