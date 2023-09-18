import type {
  GenericWorkerEventMap,
  WorkerRequest,
  WorkerResponse,
  WorkerType,
} from '.'
import type { ColumnRequest, ColumnResponse } from './column'
import type { FileRequest, FileResponse } from './file'
import type { WorkbookRequest, WorkbookResponse } from './workbook'

import ColumnWorker from './column?worker'
import FileWorker from './file?worker'
import WorkbookWorker from './workbook?worker'

export const promisifyListener = <
  Req extends WorkerRequest,
  Res extends WorkerResponse,
>(
  type: keyof Omit<GenericWorkerEventMap<Res>, 'error'>,
  worker: WorkerType<Req, Res>,
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

export const fileWorker: WorkerType<FileRequest, FileResponse> =
  new FileWorker()

export const workbookWorker: WorkerType<WorkbookRequest, WorkbookResponse> =
  new WorkbookWorker()

export const columnWorker: WorkerType<ColumnRequest, ColumnResponse> =
  new ColumnWorker()
