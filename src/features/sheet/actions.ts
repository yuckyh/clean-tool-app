import type { RootState } from '@/app/store'
import type { SheetResponse } from '@/workers/sheet'

import { promisedWorker, sheetWorker } from '@/app/workers'
import { dumpError, dumpName } from '@/lib/logger'
import { createAsyncThunk } from '@reduxjs/toolkit'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'

export const sliceName = 'sheet'

const messagePromise = pipe(
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

// export const postFormattedJSON = createAsyncThunk(
//   'sheet/postFormattedJSON',
//   async (_, { getState }) => {
//     const state = getState() as RootState
//     const { formattedColumns, sheetName, data } = state.sheet
//     const formattedFileName = getFormattedFileName(state)

//     const formattedData = data.map((item) =>
//       toObject(formattedColumns, (i) => item[i] ?? ''),
//     )

//     const formattedSheet = utils.json_to_sheet(formattedData)
//     const workbook = utils.book_new()
//     utils.book_append_sheet(workbook, formattedSheet, sheetName)

//     sheetWorker.postMessage({
//       method: 'postFormattedJSON',
//       fileName: formattedFileName,
//       workbook,
//     })

//     return (await messagePromise()).fileName
//   },
// )

export const deleteSheet = createAsyncThunk(
  `${sliceName}/deleteSheet`,
  async (_, { getState }) => {
    const { fileName } = (getState() as RootState).sheet
    sheetWorker.postMessage({ fileName, method: 'remove' })

    await messagePromise()
  },
)
