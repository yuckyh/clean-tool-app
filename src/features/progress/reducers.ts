import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'
import { getPersisted, setPersisted } from '@/lib/localStorage'

export type Progress = 'explored' | 'uploaded' | 'matched' | 'none'

interface State {
  progress: Progress
}

const sliceName = 'progress'
const defaultValue: Progress = 'none'

const initialState: State = {
  progress: getPersisted(sliceName, defaultValue),
}

// Slice
const progressSlice = createSlice({
  reducers: {
    saveProgressState: (state) => {
      const { progress } = state

      setPersisted(sliceName, progress)
    },
    setProgress: (state, { payload }: PayloadAction<Progress>) => {
      state.progress = payload
    },
    deleteProgressState: (state) => {
      state.progress = defaultValue
    },
  },
  name: sliceName,
  initialState,
})

const { actions, reducer } = progressSlice

export const { deleteProgressState, saveProgressState, setProgress } = actions
export default reducer
