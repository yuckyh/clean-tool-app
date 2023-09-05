import { getRootHandle, getRootFileHandle, writeFile } from '@/lib/file'
import type {
  Controller,
  RequestHandler,
  WorkerRequest,
  WorkerResponse,
} from '.'

export interface FileRequest extends WorkerRequest {
  file?: File
  fileName: string
}

export interface FileResponse extends WorkerResponse {
  fileName: string
  file?: File
}

type FileRequestHandler = RequestHandler<FileRequest, FileResponse>

const index: FileRequestHandler = async ({ fileName }) => {
  const existingFileHandle = await getRootFileHandle(fileName)

  const action = existingFileHandle ? 'sync' : 'init'

  return {
    action,
    fileName,
  }
}

const post: FileRequestHandler = async ({ file, fileName }) => {
  if (!file) {
    return {
      action: 'fail',
      fileName,
    }
  }

  const exists = (await index({ method: 'index', fileName })).action === 'sync'

  const fileHandle = await getRootFileHandle(fileName, !exists)

  fileHandle && (await writeFile(file, fileHandle))

  return {
    action: exists ? 'overwrite' : 'create',
    fileName: fileName,
    file,
  }
}

const del: FileRequestHandler = async ({ fileName }) => {
  const exists = (await index({ method: 'index', fileName })).action === 'sync'

  const rootHandle = await getRootHandle()
  await rootHandle.removeEntry(fileName)

  return {
    action: exists ? 'delete' : 'fail',
    fileName,
  }
}

const get: FileRequestHandler = async ({ fileName }) => {
  const exists = (await index({ method: 'index', fileName })).action === 'sync'
  const fileHandle = await getRootFileHandle(fileName)

  const file = await fileHandle?.getFile()

  return {
    action: exists ? 'get' : 'fail',
    fileName,
    file,
  }
}

const controller: Controller<FileRequest, FileRequestHandler> = {
  index,
  get,
  post,
  delete: del,
}

const main = async ({ data }: MessageEvent<FileRequest>) => {
  const { method } = data

  postMessage(await controller[method](data))
}

addEventListener('message', (event) => {
  void main(event as MessageEvent<FileRequest>)
})
