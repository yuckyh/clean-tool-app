/// <reference lib="webworker" />

import type { FileRequest, FileResponse } from './file'

export type RequestHandler = (request: FileRequest) => Promise<FileResponse>
export type Controller<T extends string | number | symbol> = Record<
  T,
  RequestHandler
>

export interface WorkerRequest {
  method: 'index' | 'post' | 'delete' | 'get'
}
