/* eslint-disable
  no-param-reassign,
  functional/immutable-data
*/
import type { PayloadAction } from '@reduxjs/toolkit'

import { getPersisted, setPersisted } from '@/lib/localStorage'
import { createSlice } from '@reduxjs/toolkit'

export type Progress = 'explored' | 'matched' | 'none' | 'uploaded'

interface State {
  progress: Progress
}

const sliceName = 'progress'
const defaultValue: Progress = 'none'

const initialState: Readonly<State> = {
  progress: getPersisted(sliceName, defaultValue),
}

// Slice
const progressSlice = createSlice({
  initialState,
  name: sliceName,
  reducers: {
    deleteProgressState: (state) => {
      state.progress = defaultValue

      return state
    },
    saveProgressState: (state) => {
      setPersisted(sliceName, state.progress)

      return state
    },
    setProgress: (state, { payload }: Readonly<PayloadAction<Progress>>) => {
      state.progress = payload

      return state
    },
  },
})

const { actions, reducer } = progressSlice

export const { deleteProgressState, saveProgressState, setProgress } = actions
export default reducer
