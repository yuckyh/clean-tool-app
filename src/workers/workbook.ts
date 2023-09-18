import XLSX, { type WorkBook } from 'xlsx'

import type {
  Controller,
  RequestHandler,
  WorkerRequest,
  WorkerResponse,
} from '.'

export interface WorkbookRequest extends WorkerRequest {
  file: File
  method: 'get'
  workbook?: WorkBook
}

export interface WorkbookResponse extends WorkerResponse {
  workbook?: WorkBook
}

type WorkbookRequestHandler = RequestHandler<WorkbookRequest, WorkbookResponse>

const get: WorkbookRequestHandler = async ({ file }) => {
  if (!file.size) {
    throw new Error('File is empty')
  }
  const workbook = XLSX.read(await file.arrayBuffer())
  return {
    status: 'ok',
    workbook,
  }
}

const controller: Controller<WorkbookRequest, WorkbookResponse> = {
  get,
}

const main = async ({ data }: MessageEvent<WorkbookRequest>) => {
  const { method } = data

  try {
    postMessage(await controller[method](data))
  } catch (error) {
    console.error(error)
    postMessage({ status: 'fail', ...data, error } as WorkbookResponse)
  }
}

addEventListener(
  'message',
  (event) => {
    void main(event as MessageEvent<WorkbookRequest>)
  },
  false,
)
