import type { AppState } from '@/app/store'
import type { SheetMethod, SheetResponse } from '@/workers/sheet'
import type * as Ref from 'fp-ts/Refinement'
import type * as T from 'fp-ts/Task'

import { sheetWorker } from '@/app/workers'
import { dumpError } from '@/lib/fp/logger'
import { promisedWorker } from '@/lib/utils'
import { createAsyncThunk } from '@reduxjs/toolkit'
import * as TE from 'fp-ts/TaskEither'
import * as f from 'fp-ts/function'

/**
 *
 */
export const sliceName = 'sheet'

const genericHandledTask = <
  Request extends WorkerRequest,
  Response extends WorkerResponse<Request['method']>,
>(
  worker: Readonly<RequestWorker<Request, Response>>,
  errorMsg: string,
): T.Task<Response> =>
  f.pipe(
    TE.tryCatch(() => promisedWorker('message', worker), dumpError),
    TE.match(
      () =>
        ({
          error: new Error(errorMsg),
          status: 'fail',
        }) as Response,
      ({ data }) => data,
    ),
  )

const handledTask: T.Task<SheetResponse> = genericHandledTask(
  sheetWorker,
  'sheetWorker failed',
)

const isSuccessful: Ref.Refinement<
  SheetResponse,
  SheetResponse<SheetMethod, 'ok'>
> = (result: SheetResponse): result is SheetResponse<SheetMethod, 'ok'> =>
  result.status === 'ok'

/**
 *
 * @returns
 * @throws
 * @example
 */
// eslint-disable-next-line functional/functional-parameters
const messageTask: T.Task<SheetResponse<SheetMethod, 'ok'>> = async () => {
  const result = await handledTask()
  if (!isSuccessful(result)) {
    throw result.error
  }
  return result
}

/**
 *
 */
export const fetchSheet = createAsyncThunk(
  `${sliceName}/fetchSheet`,
  /**
   *
   * @param _
   * @param param1
   * @param param1.getState
   * @returns
   * @example
   */
  async (_, { getState }) => {
    const { fileName } = (getState() as AppState).sheet

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
 *
 */
export const postFile = createAsyncThunk(
  `${sliceName}/postFile`,
  /**
   *
   * @param file
   * @returns
   * @example
   */
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
 *
 */
export const deleteSheet = createAsyncThunk(
  `${sliceName}/deleteSheet`,
  /**
   *
   * @param _
   * @param param1
   * @param param1.getState
   * @example
   */
  async (_, { getState }) => {
    const { fileName } = (getState() as AppState).sheet
    sheetWorker.postMessage({ fileName, method: 'remove' })

    await messageTask()
  },
)
