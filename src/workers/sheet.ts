import type { WorkBook } from 'xlsx'

import XLSX from 'xlsx'

export interface SheetRequest extends WorkerRequest {
  method: 'postFormattedJSON' | 'postFile' | 'remove' | 'get'
  workbook?: WorkBook
  fileName: string
  file?: File
}

export interface SheetResponse extends WorkerResponse {
  workbook?: WorkBook
  fileName: string
}

type Handler = RequestHandler<SheetRequest, SheetResponse>

const getRootHandle = () => navigator.storage.getDirectory()

const getRootFileHandle = (fileName: string, create?: boolean) =>
  getRootHandle().then((dir) =>
    dir.getFileHandle(fileName, {
      create,
    }),
  )

const get: Handler = async ({ fileName }) => {
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

const postFile: Handler = async ({ fileName, file }) => {
  if (!file) {
    throw new Error('No file uploaded')
  }

  const writableStream = await getRootFileHandle(fileName, true).then(
    (handle) => handle.createWritable(),
  )

  await writableStream.write(file)
  await writableStream.close()

  return { status: 'ok', fileName }
}

const postFormattedJSON: Handler = async ({ fileName, workbook }) => {
  if (!workbook) {
    throw new Error('No workbook provided')
  }

  const buffer = XLSX.write(workbook, {
    bookType: workbook.bookType,
    type: 'array',
  }) as ArrayBuffer

  const file = new File([buffer], fileName)

  const writableStream = await getRootFileHandle(fileName, true).then(
    (handle) => handle.createWritable(),
  )

  await writableStream.write(file)
  await writableStream.close()

  return { status: 'ok', fileName }
}

const remove: Handler = async ({ fileName }) => {
  await getRootHandle().then((root) => root.removeEntry(fileName))

  return { status: 'ok', fileName }
}

const controller: Controller<SheetRequest, SheetResponse> = {
  postFormattedJSON,
  postFile,
  remove,
  get,
}

const main = async (data: SheetRequest) => {
  const { method } = data
  try {
    const response = await controller[method](data)
    postMessage(response)
  } catch (error) {
    console.error(error)
    postMessage({ status: 'fail', ...data, error } as SheetResponse)
  }
}

globalThis.addEventListener(
  'message',
  ({ data }: MessageEvent<SheetRequest>) => {
    main(data).catch(console.error)
  },
)

globalThis.addEventListener('error', ({ error }) => {
  console.error(error)
})
