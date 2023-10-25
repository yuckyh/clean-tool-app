import type { RootState } from '@/app/store'
import type { SheetResponse } from '@/workers/sheet'

import { promisedWorker, sheetWorker } from '@/app/workers'
import { dumpError } from '@/lib/logger'
import { createAsyncThunk } from '@reduxjs/toolkit'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import * as f from 'fp-ts/function'

export const sliceName = 'sheet'

const messagePromise = f.pipe(
  TE.tryCatch(() => promisedWorker('message', sheetWorker), dumpError),
  TE.map(({ data }) => data),
  TE.getOrElse(() =>
    T.of<SheetResponse>({
      error: new Error('sheetWorker failed'),
      fileName: '',
      status: 'fail',
    }),
  ),
)

export const fetchSheet = createAsyncThunk(
  `${sliceName}/fetchSheet`,
  async (_, { getState }) => {
    const { fileName } = (getState() as RootState).sheet

    sheetWorker.postMessage({ fileName, method: 'get' })

    const { workbook } = await messagePromise()

    return {
      SheetNames: workbook?.SheetNames,
      Sheets: workbook?.Sheets,
      bookType: workbook?.bookType,
      fileName,
    }
  },
)

export const postFile = createAsyncThunk(
  `${sliceName}/postFile`,
  async (file: File) => {
    const buffer = await file.arrayBuffer()

    sheetWorker.postMessage(
      {
        file,
        method: 'postFile',
      },
      [buffer],
    )

    const promise = await messagePromise()

    return promise.fileName
  },
)

export const deleteSheet = createAsyncThunk(
  `${sliceName}/deleteSheet`,
  async (_, { getState }) => {
    const { fileName } = (getState() as RootState).sheet
    sheetWorker.postMessage({ fileName, method: 'remove' })

    await messagePromise()
  },
)
