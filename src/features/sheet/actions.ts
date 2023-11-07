import type { AppState } from '@/app/store'
import type { SheetResponse } from '@/workers/sheet'
import type * as T from 'fp-ts/Task'

import { sheetWorker } from '@/app/workers'
import { dumpError } from '@/lib/fp/logger'
import { promisedWorker } from '@/lib/utils'
import { createAsyncThunk } from '@reduxjs/toolkit'
import * as TE from 'fp-ts/TaskEither'
import * as f from 'fp-ts/function'

export const sliceName = 'sheet'

const messagePromise: T.Task<SheetResponse<'fail'> | SheetResponse<'ok'>> =
  f.pipe(
    TE.tryCatch(() => promisedWorker('message', sheetWorker), dumpError),
    TE.matchW(
      () => ({
        error: new Error('sheetWorker failed'),
        fileName: '',
        status: 'fail',
      }),
      ({ data }) => data,
    ),
  )

export const fetchSheet = createAsyncThunk(
  `${sliceName}/fetchSheet`,
  async (_, { getState }) => {
    const { fileName } = (getState() as AppState).sheet

    sheetWorker.postMessage({ fileName, method: 'get' })

    const { workbook } = (await messagePromise()) as SheetResponse<'ok'>

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

    const { fileName } = await messagePromise()

    return fileName
  },
)

export const deleteSheet = createAsyncThunk(
  `${sliceName}/deleteSheet`,
  async (_, { getState }) => {
    const { fileName } = (getState() as AppState).sheet
    sheetWorker.postMessage({ fileName, method: 'remove' })

    await messagePromise()
  },
)
