import type {
  Controller,
  RequestHandler,
  WorkerRequest,
  WorkerResponse,
} from '.'

export interface FileRequest extends WorkerRequest {
  file?: File
  fileName: string
  method: 'get' | 'post' | 'remove'
}

export interface FileResponse extends WorkerResponse {
  file?: File
  fileName: string
}

type FileRequestHandler = RequestHandler<FileRequest, FileResponse>

const getRootFileHandle = async (fileName: string, create?: boolean) =>
  await (
    await navigator.storage.getDirectory()
  ).getFileHandle(fileName, {
    create,
  })

const post: FileRequestHandler = async ({ file, fileName }) => {
  if (!file) {
    throw new Error('No file uploaded')
  }

  const fileHandle = await getRootFileHandle(fileName, true)
  const writableStream = await fileHandle.createWritable()

  await writableStream.write(file)
  void writableStream.close()

  return {
    fileName,
    status: 'ok',
  }
}

const remove: FileRequestHandler = async ({ fileName }) => {
  const rootHandle = await navigator.storage.getDirectory()
  await rootHandle.removeEntry(fileName)

  return {
    fileName,
    status: 'ok',
  }
}

const get: FileRequestHandler = async ({ fileName }) => {
  const fileHandle = await getRootFileHandle(fileName)

  const file = await fileHandle.getFile()

  return {
    file,
    fileName,
    status: 'ok',
  }
}

const controller: Controller<FileRequest, FileResponse> = {
  get,
  post,
  remove,
}

const main = async (data: FileRequest) => {
  const { method } = data
  try {
    const response = await controller[method](data)
    const buffer = await response.file?.arrayBuffer()
    postMessage(response, buffer ? [buffer] : [])
  } catch (error) {
    console.error(error)
    postMessage({ status: 'fail', ...data, error } as FileResponse)
  }
}

addEventListener('message', ({ data }) => {
  void main(data as FileRequest)
})

addEventListener('error', ({ error }) => {
  console.error(error)
})
