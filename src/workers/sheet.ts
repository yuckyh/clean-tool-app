/**
 * @file This file contains the sheet worker's controller.
 */

import type { WorkBook } from 'xlsx'

import { dumpError } from '@/lib/fp/logger'
import * as f from 'fp-ts/function'
import XLSX from 'xlsx'

export type SheetMethod = 'get' | 'postFile' | 'remove'

/**
 * The type of the worker's request.
 */
export type SheetRequest<Method extends SheetMethod = SheetMethod> = (
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
  WorkerRequest<Method>

interface SheetOkResponse<M extends SheetMethod>
  extends WorkerResponse<M, 'ok'> {
  fileName: string
  method: M
  workbook?: WorkBook
}

/**
 * The type of the worker's response.
 */
export type SheetResponse<
  M extends SheetMethod = SheetMethod,
  S extends ResponseStatus = ResponseStatus,
> = WorkerResponse<M, S> &
  (SheetOkResponse<M> | WorkerResponse<SheetMethod, 'fail'>)

type Handler<Method extends SheetRequest['method'] = SheetRequest['method']> =
  RequestHandler<SheetRequest<Method>, SheetResponse<Method>>

const getRootHandle = f.constant(navigator.storage.getDirectory())

const getRootFileHandle = (fileName: string, create?: boolean) =>
  getRootHandle().then((dir) =>
    dir.getFileHandle(fileName, {
      create,
    }),
  )

const get: Handler<'get'> = async ({ fileName, method }) => {
  const fileHandle = await getRootFileHandle(fileName)

  const workbook = await fileHandle
    .getFile()
    .then((file) => file.arrayBuffer())
    .then(XLSX.read)

  return {
    fileName,
    method,
    status: 'ok',
    workbook,
  }
}

const postFile: Handler<'postFile'> = async ({ file, method }) => {
  const writableStream = await getRootFileHandle(file.name, true).then(
    (handle) => handle.createWritable(),
  )

  await writableStream
    .write(file)
    .then(() => writableStream.close())
    .catch(dumpError)

  return { fileName: file.name, method, status: 'ok' }
}

const remove: Handler<'remove'> = async ({ fileName, method }) => {
  await getRootHandle().then((root) => root.removeEntry(fileName))

  return { fileName, method, status: 'ok' }
}

const controller: Readonly<Controller<SheetRequest, SheetResponse>> = {
  get: get as Handler,
  postFile: postFile as Handler,
  remove: remove as Handler,
}

const main = async (data: Readonly<SheetRequest>) => {
  const { method } = data
  try {
    const response = await controller[method](data)
    globalThis.postMessage(response)
  } catch (error) {
    dumpError(error as Error)
    globalThis.postMessage({ error, status: 'fail' } as SheetResponse<
      SheetMethod,
      'fail'
    >)
  }
}

globalThis.addEventListener(
  'message',
  ({ data }: Readonly<MessageEvent<SheetRequest>>) => {
    main(data).catch(dumpError)
  },
)

globalThis.addEventListener('error', ({ error }: Readonly<ErrorEvent>) => {
  dumpError(error as Error)
})
