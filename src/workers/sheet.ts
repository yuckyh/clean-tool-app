import type { WorkBook } from 'xlsx'

import { dumpError } from '@/lib/logger'
import { constant } from 'fp-ts/function'
import XLSX from 'xlsx'

export type SheetRequest = (
  | {
      file: File
      method: 'postFile'
    }
  | {
      fileName: string
      method: 'get'
    }
  | {
      fileName: string
      method: 'remove'
    }
) &
  WorkerRequest

export type SheetResponse = WorkerResponse & {
  fileName: string
  workbook?: WorkBook
}

type Handler<Method extends SheetRequest['method'] = SheetRequest['method']> =
  RequestHandler<SheetRequest & { method: Method }, SheetResponse, Method>

const getRootHandle = constant(navigator.storage.getDirectory())

const getRootFileHandle = (fileName: string, create?: boolean) =>
  getRootHandle().then((dir) =>
    dir.getFileHandle(fileName, {
      create,
    }),
  )

const get: Handler<'get'> = async ({ fileName }) => {
  const fileHandle = await getRootFileHandle(fileName)

  const workbook = await fileHandle
    .getFile()
    .then((file) => file.arrayBuffer())
    .then(XLSX.read)

  return {
    fileName,
    status: 'ok',
    workbook,
  }
}

const postFile: Handler<'postFile'> = async ({ file }) => {
  const writableStream = await getRootFileHandle(file.name, true).then(
    (handle) => handle.createWritable(),
  )

  await writableStream
    .write(file)
    .then(() => writableStream.close())
    .catch(dumpError)

  return { fileName: file.name, status: 'ok' }
}

const remove: Handler<'remove'> = async ({ fileName }) => {
  await getRootHandle().then((root) => root.removeEntry(fileName))

  return { fileName, status: 'ok' }
}

const controller: Controller<SheetRequest, SheetResponse> = {
  get: get as Handler,
  // postFormattedJSON,
  postFile: postFile as Handler,
  remove: remove as Handler,
}

const main = async (data: SheetRequest) => {
  const { method } = data
  try {
    const response = await controller[method](data)
    globalThis.postMessage(response)
  } catch (error) {
    dumpError(error as Error)
    globalThis.postMessage({ status: 'fail', ...data, error } as SheetResponse)
  }
}

globalThis.addEventListener(
  'message',
  ({ data }: MessageEvent<SheetRequest>) => {
    main(data).catch(dumpError)
    return undefined
  },
)

globalThis.addEventListener('error', ({ error }: ErrorEvent) => {
  dumpError(error as Error)
  return undefined
})
