/* eslint-disable no-param-reassign */
/* eslint-disable functional/immutable-data */
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

      return state
    },
    setProgress: (state, { payload }: PayloadAction<Progress>) => {
      state.progress = payload

      return state
    },
    deleteProgressState: (state) => {
      state.progress = defaultValue

      return state
    },
  },
  name: sliceName,
  initialState,
})

const { actions, reducer } = progressSlice

export const { deleteProgressState, saveProgressState, setProgress } = actions
export default reducer
