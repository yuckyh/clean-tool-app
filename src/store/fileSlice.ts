import { fileWorker, promisifyListener } from '@/workers/static'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import type { RootState } from '.'

import { getPersisted, setPersisted } from './utils'

interface State {
  file?: File
  fileName: string
}

const name = 'fileName'
const defaultValue = ''

export const getFile = createAsyncThunk(
  `${name}/getFile`,
  async (fileName: string) => {
    fileWorker.postMessage({ fileName, method: 'get' })

    const {
      data: { file },
    } = await promisifyListener('message', fileWorker)

    return { file }
  },
)

export const postFile = createAsyncThunk(
  `${name}/postFile`,
  async ({ file }: { file: File }) => {
    const buffer = await file.arrayBuffer()

    fileWorker.postMessage(
      {
        file,
        fileName: file.name,
        method: 'post',
      },
      [buffer],
    )

    const {
      data: { fileName },
    } = await promisifyListener('message', fileWorker)

    return { fileName }
  },
)

export const deleteFile = createAsyncThunk(
  `${name}/deleteFile`,
  async (_, { getState }) => {
    const {
      file: { fileName },
    } = getState() as RootState
    fileWorker.postMessage({ fileName, method: 'remove' })

    await promisifyListener('message', fileWorker)

    return { fileName: defaultValue }
  },
)

const update = (state: State) => {
  const { fileName } = state
  setPersisted(name, fileName)
  return state
}

const initialState: State = {
  fileName: getPersisted(name, defaultValue),
}

const fileSlice = createSlice({
  extraReducers: (builder) => {
    builder
      .addCase(getFile.fulfilled, (state, { payload: { file } }) => {
        state.file = file
        update(state)
      })
      .addCase(postFile.fulfilled, (state, { payload: { fileName } }) => {
        state.fileName = fileName
        update(state)
      })
      .addCase(deleteFile.fulfilled, (state) => {
        state = { ...initialState }
        state.fileName = defaultValue
        return update(state)
      })
  },
  initialState: update(initialState),
  name,
  reducers: {},
})

export default fileSlice.reducer
