import XLSX, { type WorkBook } from 'xlsx'
import type {
  Controller,
  RequestHandler,
  WorkerRequest,
  WorkerResponse,
} from '.'

export interface WorkbookRequest extends WorkerRequest {
  method: 'get'
  workbook?: WorkBook
  file: File
}

export interface WorkbookResponse extends WorkerResponse {
  workbook?: WorkBook
}

type WorkbookRequestHandler = RequestHandler<WorkbookRequest, WorkbookResponse>

const get: WorkbookRequestHandler = async ({ file }) => {
  if (!file.size) {
    return {
      action: 'fail',
    }
  }
  const workbook = XLSX.read(await file.arrayBuffer())
  return {
    action: 'get',
    workbook,
  }
}

const controller: Controller<WorkbookRequest, WorkbookRequestHandler> = {
  get,
}

const main = async ({ data }: MessageEvent<WorkbookRequest>) => {
  const { method } = data

  postMessage(await controller[method](data))
}

addEventListener(
  'message',
  (event) => {
    void main(event as MessageEvent<WorkbookRequest>)
  },
  false,
)
