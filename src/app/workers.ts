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
 *
 */
export const sheetWorker: Readonly<RequestWorker<SheetRequest, SheetResponse>> =
  new SheetWorker()

/**
 *
 */
export const columnWorker: Readonly<
  RequestWorker<ColumnRequest, ColumnResponse>
> = new ColumnWorker()

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
