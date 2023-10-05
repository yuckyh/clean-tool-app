import type { RootState } from '@/app/store'

import { createAsyncThunk } from '@reduxjs/toolkit'
import { promisedWorker } from '@/lib/utils'
import { sheetWorker } from '@/app/workers'
import { toObject } from '@/lib/array'
import { utils } from 'xlsx'

import { getFormattedFileName, getColumns, getData } from './selectors'
import { getFormattedColumns } from '../columns/selectors'

const messagePromise = () => promisedWorker('message', sheetWorker)

export const fetchWorkbook = createAsyncThunk(
  'sheet/fetchWorkbook',
  async (fileName: string) => {
    sheetWorker.postMessage({ method: 'get', fileName })

    const { workbook } = (await messagePromise()).data

    return {
      SheetNames: workbook?.SheetNames,
      bookType: workbook?.bookType,
      Sheets: workbook?.Sheets,
      fileName,
    }
  },
)

export const postFile = createAsyncThunk(
  'sheet/postFile',
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

    return (await messagePromise()).data.fileName
  },
)

export const postFormattedJSON = createAsyncThunk(
  'sheet/postFormattedJSON',
  async (_, { getState }) => {
    const formattedColumns = getFormattedColumns(getState() as RootState)
    const originalColumns = getColumns(getState() as RootState)
    const data = getData(getState() as RootState)
    const { sheetName } = (getState() as RootState).sheet
    const formattedFileName = getFormattedFileName(getState() as RootState)

    const formattedData = data.map((item) =>
      toObject(formattedColumns, (i) => item[originalColumns[i] ?? ''] ?? ''),
    )

    const formattedSheet = utils.json_to_sheet(formattedData)
    const workbook = utils.book_new()
    utils.book_append_sheet(workbook, formattedSheet, sheetName)

    sheetWorker.postMessage({
      method: 'postFormattedJSON',
      fileName: formattedFileName,
      workbook,
    })

    return (await messagePromise()).data.fileName
  },
)

export const deleteWorkbook = createAsyncThunk(
  'sheet/deleteWorkbook',
  async (_, { getState }) => {
    const { fileName } = (getState() as RootState).sheet
    sheetWorker.postMessage({ method: 'remove', fileName })

    await messagePromise()
  },
)
