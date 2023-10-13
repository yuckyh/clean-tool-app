import type { ColumnResponse, ColumnRequest } from '@/workers/column'
import type { SheetResponse, SheetRequest } from '@/workers/sheet'

import ColumnWorker from '@/workers/column?worker'
import SheetWorker from '@/workers/sheet?worker'

export const sheetWorker: RequestWorker<SheetRequest, SheetResponse> =
  new SheetWorker()

export const columnWorker: RequestWorker<ColumnRequest, ColumnResponse> =
  new ColumnWorker()

export const promisedWorker = <
  Req extends WorkerRequest,
  Res extends WorkerResponse,
>(
  type: keyof Omit<GenericWorkerEventMap<Res>, 'error'>,
  worker: RequestWorker<Req, Res>,
  options: AddEventListenerOptions = { once: true },
) =>
  new Promise<GenericWorkerEventMap<Res>[typeof type]>((resolve, reject) => {
    worker.addEventListener(
      type,
      (event) => {
        if (event.data.status === 'fail') {
          reject(event)
        }

        resolve(event)
      },
      options,
    )

    worker.addEventListener(
      'error',
      (event) => {
        reject(event)
      },
      options,
    )
  })
