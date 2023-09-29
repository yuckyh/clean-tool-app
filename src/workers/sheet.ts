import type { WorkBook } from 'xlsx'

import { getFormattedFileName } from '@/lib/string'
import { just } from '@/lib/utils'
import XLSX from 'xlsx'

export interface SheetRequest extends WorkerRequest {
  file?: File
  fileName: string
  method: 'get' | 'postFile' | 'postFormattedJSON' | 'remove'
  workbook?: WorkBook
}

export interface SheetResponse extends WorkerResponse {
  file?: File
  fileName: string
  workbook?: WorkBook
}

type Handler = RequestHandler<SheetRequest, SheetResponse>

const getRootFileHandle = async (fileName: string, create?: boolean) =>
  await (
    await navigator.storage.getDirectory()
  ).getFileHandle(fileName, {
    create,
  })

const get: Handler = async ({ fileName }) => {
  const fileHandle = await just(fileName)(getRootFileHandle)()

  const file = await fileHandle.getFile()
  const workbook = await file.arrayBuffer().then(XLSX.read)

  return {
    file,
    fileName,
    status: 'ok',
    workbook,
  }
}

const postFile: Handler = async ({ file, fileName }) => {
  if (!file) {
    throw new Error('No file uploaded')
  }

  const fileHandle = await getRootFileHandle(fileName, true)
  const writableStream = await fileHandle.createWritable()

  await writableStream.write(file)
  void writableStream.close()

  return { fileName, status: 'ok' }
}

const postFormattedJSON: Handler = async ({ fileName, workbook }) => {
  if (!workbook) {
    throw new Error('No workbook provided')
  }

  const formattedFileName = just(fileName)(getFormattedFileName)()

  const buffer = XLSX.write(workbook, {
    bookType: workbook.bookType,
    type: 'array',
  }) as ArrayBuffer

  const file = new File([buffer], formattedFileName)

  const fileHandle = await getRootFileHandle(formattedFileName, true)
  const writableStream = await fileHandle.createWritable()

  await writableStream.write(file)
  void writableStream.close()

  return { fileName, status: 'ok' }
}

const remove: Handler = async ({ fileName }) => {
  const rootHandle = await navigator.storage.getDirectory()
  await rootHandle.removeEntry(fileName)

  return { fileName, status: 'ok' }
}

const controller: Controller<SheetRequest, SheetResponse> = {
  get,
  postFile,
  postFormattedJSON,
  remove,
}

const main = async (data: SheetRequest) => {
  const { method } = data
  try {
    const response = await controller[method](data)
    const buffer = await response.file?.arrayBuffer()
    postMessage(response, buffer ? [buffer] : [])
  } catch (error) {
    console.error(error)
    postMessage({ status: 'fail', ...data, error } as SheetResponse)
  }
}

addEventListener('message', ({ data }) => {
  void main(data as SheetRequest)
})

addEventListener('error', ({ error }) => {
  console.error(error)
})
