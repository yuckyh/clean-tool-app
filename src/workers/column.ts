import type codebook from '@/../data/codebook.json'
import type Fuse from 'fuse.js'

import fuse from '@/lib/fuse'

import type {
  Controller,
  RequestHandler,
  WorkerRequest,
  WorkerResponse,
} from '.'

export type CodebookMatch = Partial<(typeof codebook)[0]>

export interface ColumnRequest extends WorkerRequest {
  columns: string[]
  method: 'get'
}

export interface ColumnResponse extends WorkerResponse {
  matches: Omit<Fuse.FuseResult<CodebookMatch>, 'matches'>[][]
}

type ColumnRequestHandler = RequestHandler<ColumnRequest, ColumnResponse>

const get: ColumnRequestHandler = async ({ columns }) =>
  await Promise.resolve({
    matches: columns.map((column) => fuse.search(column)),
    status: 'ok',
  })

const controller: Controller<ColumnRequest, ColumnResponse> = {
  get,
}

const main = async ({ data }: MessageEvent<ColumnRequest>) => {
  const { method } = data

  postMessage(await controller[method](data))
}

addEventListener(
  'message',
  (event) => {
    void main(event as MessageEvent<ColumnRequest>)
  },
  false,
)
