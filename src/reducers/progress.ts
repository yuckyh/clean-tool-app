/* eslint-disable
  no-param-reassign,
  functional/immutable-data
*/
import type { PayloadAction } from '@reduxjs/toolkit'

import { getPersisted, setPersisted } from '@/lib/localStorage'
import { createSlice } from '@reduxjs/toolkit'

/**
 * The possible progress states
 */
export type Progress = 'explored' | 'matched' | 'none' | 'uploaded'

/**
 * The progress state
 */
interface State {
  /**
   * The progress state
   */
  progress: Progress
}

const sliceName = 'progress'
const defaultValue: Progress = 'none'

const initialState: Readonly<State> = {
  progress: getPersisted(sliceName, defaultValue),
}

const { actions, reducer } = createSlice({
  initialState,
  name: sliceName,
  reducers: {
    deleteProgress: (state) => {
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

export const { deleteProgress, saveProgressState, setProgress } = actions
export default reducer
