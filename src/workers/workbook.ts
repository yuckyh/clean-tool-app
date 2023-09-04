import XLSX, { type WorkBook } from 'xlsx'
import type {
  Controller,
  RequestHandler,
  WorkerRequest,
  WorkerResponse,
} from '.'

export interface WorkbookRequest extends WorkerRequest {
  workbook?: WorkBook
  file?: File
}

export interface WorkbookResponse extends WorkerResponse {
  workbook?: WorkBook
}

type WorkbookRequestHandler = RequestHandler<WorkbookRequest, WorkbookResponse>

const get: WorkbookRequestHandler = async ({ file }) => {
  if (!file) {
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
  index: async () => {
    await new Promise((res) => {
      res('convert')
    })
    return {
      action: 'sync',
    }
  },
  get,
  post: async () => {
    await new Promise((res) => {
      res('convert')
    })
    return {
      action: 'create',
    }
  },
  delete: async () => {
    await new Promise((res) => {
      res('convert')
    })
    return {
      action: 'delete',
    }
  },
}

const main = async ({ data }: MessageEvent<WorkbookRequest>) => {
  const { method } = data

  postMessage(await controller[method](data))
  postMessage('This is from the workbook worker')
}

addEventListener(
  'message',
  (event) => {
    void main(event as MessageEvent<WorkbookRequest>)
  },
  false,
)
