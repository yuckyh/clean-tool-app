/**
 * @file This file contains the worker's instances and utilities.
 * @module app/workers
 */

import type { ColumnRequest, ColumnResponse } from '@/workers/column'
import type { SheetRequest, SheetResponse } from '@/workers/sheet'
import type * as T from 'fp-ts/Task'

import { dumpError } from '@/lib/fp/logger'
import { promisedWorker } from '@/lib/utils'
import ColumnWorker from '@/workers/column?worker'
import SheetWorker from '@/workers/sheet?worker'
import * as TE from 'fp-ts/TaskEither'
import * as f from 'fp-ts/function'

/**
 * The sheet worker.
 * @example
 *  sheetWorker.postMessage({
 *    fileName,
 *    method: 'get',
 *  })
 */
export const sheetWorker: Readonly<RequestWorker<SheetRequest, SheetResponse>> =
  new SheetWorker()

/**
 * The column worker.
 * @example
 *  columnWorker.postMessage({
 *    columns,
 *    method: 'get',
 *  })
 */
export const columnWorker: Readonly<
  RequestWorker<ColumnRequest, ColumnResponse>
> = new ColumnWorker()

/**
 * Creates a task that has a handled error.
 * @param worker - The worker to post the message to.
 * @param errorMsg - The error message to display.
 * @returns A task that has a handled error.
 * @example
 *  const handledTask: T.Task<ColumnResponse> = createHandledTask<
 *    ColumnRequest,
 *    ColumnResponse
 *  >(columnWorker, 'columnWorker failed')
 */
export const createHandledTask = <
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
