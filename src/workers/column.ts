import type { codebook } from '@/data'
import type Fuse from 'fuse.js'

import fuse from '@/lib/fuse'

export type CodebookEntry = (typeof codebook)[0]

export interface ColumnRequest extends WorkerRequest {
  columns: string[]
  method: 'get'
}

export interface ColumnResponse extends WorkerResponse {
  matches: Omit<Fuse.FuseResult<CodebookEntry>, 'matches'>[][]
}

type Handler = RequestHandler<ColumnRequest, ColumnResponse>

const get: Handler = async ({ columns }) =>
  await Promise.resolve({
    matches: columns.map((column) => fuse.search(column)),
    status: 'ok',
  })

const controller: Controller<ColumnRequest, ColumnResponse> = {
  get,
}

const main = async (data: ColumnRequest) => {
  const { method } = data

  postMessage(await controller[method](data))
}

addEventListener(
  'message',
  ({ data }: MessageEvent<ColumnRequest>) => {
    void main(data)
  },
  false,
)
