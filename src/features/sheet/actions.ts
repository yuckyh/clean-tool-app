import { createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'

import { promisedWorker, sheetWorker } from '@/app/workers'

export const sliceName = 'sheet'

const messagePromise = async () =>
  (await promisedWorker('message', sheetWorker)).data

export const fetchSheet = createAsyncThunk(
  `${sliceName}/fetchSheet`,
  async (_, { getState }) => {
    const { fileName } = (getState() as RootState).sheet

    sheetWorker.postMessage({ method: 'get', fileName })

    const { workbook } = await messagePromise()
    return {
      SheetNames: workbook?.SheetNames,
      bookType: workbook?.bookType,
      Sheets: workbook?.Sheets,
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
        fileName: file.name,
        method: 'postFile',
        file,
      },
      [buffer],
    )

    return (await messagePromise()).fileName
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
    sheetWorker.postMessage({ method: 'remove', fileName })

    await messagePromise()
  },
)
