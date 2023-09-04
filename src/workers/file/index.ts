import { getRootHandle, getWorkFileHandle } from './storage'
import { writeFile } from './storage'
import type { Controller, RequestHandler, WorkerRequest } from '@/workers'

export interface FileRequest extends WorkerRequest {
  file?: File
  fileName: string
}

export interface FileResponse {
  action: 'init' | 'create' | 'sync' | 'overwrite' | 'delete' | 'fail'
  fileName: string
}

const index: RequestHandler = async ({ fileName }) => {
  const existingFileHandle = await getWorkFileHandle(fileName)

  const action = existingFileHandle ? 'sync' : 'init'

  return {
    action,
    fileName,
  }
}

const post: RequestHandler = async ({ file, fileName }) => {
  if (!file) {
    return {
      action: 'fail',
      fileName,
    }
  }

  const exists = (await index({ method: 'index', fileName })).action === 'sync'

  const fileHandle = await getWorkFileHandle(fileName, !exists)

  fileHandle && (await writeFile(file, fileHandle))

  return {
    action: exists ? 'overwrite' : 'create',
    fileName: fileName,
  }
}

const del: RequestHandler = async ({ fileName }) => {
  const exists = (await index({ method: 'index', fileName })).action === 'sync'

  const rootHandle = await getRootHandle()
  await rootHandle.removeEntry(fileName)

  return {
    action: exists ? 'delete' : 'fail',
    fileName,
  }
}

const controller: Controller<FileRequest['method']> = {
  index,
  post,
  delete: del,
  get: async (data) => {
    return await new Promise(() => {
      console.log(data)
    })
  },
}

const main = async ({ data }: MessageEvent<FileRequest>) => {
  const { method } = data

  postMessage(await controller[method](data))
}

addEventListener('message', (event) => {
  void main(event as MessageEvent<FileRequest>)
})
