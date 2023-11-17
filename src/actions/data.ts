/**
 * @file This file contains the actions for the data slice.
 * @module actions/data
 */

import type { AppState } from '@/app/store'
import type { SheetMethod, SheetResponse } from '@/workers/sheet'
import type * as Ref from 'fp-ts/Refinement'
import type * as T from 'fp-ts/Task'

import { createHandledTask, sheetWorker } from '@/app/workers'
import { createAsyncThunk } from '@reduxjs/toolkit'

/**
 * The name of the slice that this file is responsible for.
 */
export const sliceName = 'data'

const handledTask: T.Task<SheetResponse> = createHandledTask(
  sheetWorker,
  'sheetWorker failed',
)

/**
 * This refinement checks whether the given response is successful.
 * @param response - The response to check.
 * @returns Whether the given response is successful.
 * @example
 *  const response = await handledTask()
 *  if (!isSuccessful(response)) {
 *    throw response.error
 *  }
 *  return response
 */
const isSuccessful: Ref.Refinement<
  SheetResponse,
  SheetResponse<SheetMethod, 'ok'>
> = (response: SheetResponse): response is SheetResponse<SheetMethod, 'ok'> =>
  response.status === 'ok'

/**
 *
 * @returns
 * @throws
 * @example
 */

const messageTask: T.Task<SheetResponse<SheetMethod, 'ok'>> = async () => {
  const response = await handledTask()
  if (!isSuccessful(response)) {
    throw response.error
  }
  return response
}

/**
 * This action fetches the sheet from the worker.
 * @returns A promise containing the sheetWorker response.
 * @example
 * ```tsx
 *  const dispatch = useAppDispatch()
 *  const fetchSheet = useCallback(() => dispatch(fetchSheet()), [dispatch])
 * ```
 */
export const fetchSheet = createAsyncThunk(
  `${sliceName}/fetchSheet`,
  async (_, { getState }) => {
    const { fileName } = (getState() as AppState).data

    sheetWorker.postMessage({ fileName, method: 'get' })

    const { workbook } = await messageTask()

    return {
      SheetNames: workbook?.SheetNames,
      Sheets: workbook?.Sheets,
      bookType: workbook?.bookType,
      fileName,
    }
  },
)

/**
 * This action posts the given file to the worker.
 * @param file - The file to post to the worker.
 * @returns A promise containing the sheetWorker response.
 * @example
 * ```tsx
 *  const dispatch = useAppDispatch()
 *  const postFile = useCallback((file: File) => dispatch(postFile(file)), [
 *   dispatch,
 *  ])
 * ```
 */
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

    const { fileName } = await messageTask()

    return fileName
  },
)

/**
 * This action deletes the current sheet from the worker.
 * @returns A promise containing the sheetWorker response.
 * @example
 * ```tsx
 *  const dispatch = useAppDispatch()
 *  const deleteSheet = useCallback(() => dispatch(deleteSheet()), [dispatch])
 * ```
 */
export const deleteSheet = createAsyncThunk(
  `${sliceName}/deleteSheet`,
  async (_, { getState }) => {
    const { fileName } = (getState() as AppState).data
    sheetWorker.postMessage({ fileName, method: 'remove' })

    await messageTask()
  },
)
