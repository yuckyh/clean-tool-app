/**
 * @file This file contains the sheet worker's controller.
 */

import type { WorkBook } from 'xlsx'

import { dumpError } from '@/lib/fp/logger'
import * as T from 'fp-ts/Task'
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

/**
 *
 */
interface SheetOkResponse<M extends SheetMethod>
  extends WorkerResponse<M, 'ok'> {
  /**
   * The name of the file.
   */
  fileName: string
  /**
   * The request method of the sent request for debugging purposes.
   */
  method: M
  /**
   * The workbook object.
   */
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

/**
 * The function to get the root directory handle in the OPFS.
 * @returns The root directory handle in the OPFS.
 * @example
 *  const rootHandle = await getRootHandle()
 */
const getRootHandle: T.Task<FileSystemDirectoryHandle> = f.constant(
  navigator.storage.getDirectory(),
)

/**
 * The function to get the root file handle in the OPFS.
 * @param fileName - The name of the file to be retrieved.
 * @param create - Whether to create the file if it doesn't exist.
 * @returns The root file handle in the OPFS.
 * @example
 *  const rootFileHandle = await getRootFileHandle('foo.xlsx')
 */
const getRootFileHandle = (fileName: string, create?: boolean) =>
  f.pipe(
    getRootHandle,
    T.flatMap((dir) =>
      f.constant(
        dir.getFileHandle(fileName, {
          create,
        }),
      ),
    ),
  )

/**
 * The function to get the workbook from the OPFS.
 * @param request - The {@link SheetRequest request} for the function.
 * @param request.fileName - The name of the file to be retrieved.
 * @param request.method - The request's method that was sent.
 * @returns The {@link SheetResponse response} for the function with a workbook on success.
 * @example
 *  const response = get({ fileName: 'foo.xlsx', method: 'get' })
 */
const get: Handler<'get'> = async ({ fileName, method }) => {
  const workbook = await f.pipe(
    fileName,
    getRootFileHandle,
    T.flatMap((handle) => f.constant(handle.getFile())),
    T.flatMap((file) => f.constant(file.arrayBuffer())),
    T.map(XLSX.read),
  )()

  return { fileName, method, status: 'ok', workbook }
}

/**
 * The function to post a file to the OPFS.
 * @param request - The {@link SheetRequest request} for the function.
 * @param request.file - The file to be posted.
 * @param request.method - The request's method that was sent.
 * @returns The {@link SheetResponse response} for the function.
 * @example
 *  const response = postFile({ file: file, method: 'postFile' })
 */
const postFile: Handler<'postFile'> = async ({ file, method }) => {
  const writableStream = await f.pipe(
    getRootFileHandle(file.name, true),
    T.flatMap((handle) => f.constant(handle.createWritable())),
  )()

  await writableStream.write(file).then(() => writableStream.close())

  return { fileName: file.name, method, status: 'ok' }
}

/**
 * The function to remove a file from the OPFS.
 * @param request - The {@link SheetRequest request} for the function.
 * @param request.fileName - The name of the file to be removed.
 * @param request.method - The request's method that was sent.
 * @returns The {@link SheetResponse response} for the function.
 * @example
 *  const response = remove({ fileName: 'foo.xlsx', method: 'remove' })
 */
const remove: Handler<'remove'> = async ({ fileName, method }) => {
  await f
    .pipe(
      getRootHandle,
      T.flatMap((dir) => f.constant(dir.removeEntry(fileName))),
    )()
    .catch(dumpError)

  return { fileName, method, status: 'ok' }
}

/**
 * The controller for the worker.
 */
const controller: Readonly<Controller<SheetRequest, SheetResponse>> = {
  get: get as Handler,
  postFile: postFile as Handler,
  remove: remove as Handler,
}

/**
 * The main function for the worker.
 * @param data - The {@link SheetRequest request} for the function.
 * @returns The {@link SheetResponse response} for the function.
 * @example
 *  const response = main({ fileName: 'foo.xlsx', method: 'get' })
 */
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
