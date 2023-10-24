import { constant } from 'fp-ts/function'
import type { WorkBook } from 'xlsx'

import XLSX from 'xlsx'
import { dumpError } from '@/lib/logger'

export type SheetRequest = (
  | {
      method: 'remove'
      fileName: string
    }
  | {
      fileName: string
      method: 'get'
    }
  | {
      method: 'postFile'
      file: File
    }
) &
  WorkerRequest

export type SheetResponse = WorkerResponse & {
  workbook?: WorkBook
  fileName: string
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
    status: 'ok',
    fileName,
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

  return { status: 'ok', fileName }
}

const controller: Controller<SheetRequest, SheetResponse> = {
  // postFormattedJSON,
  postFile: postFile as Handler,
  remove: remove as Handler,
  get: get as Handler,
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
