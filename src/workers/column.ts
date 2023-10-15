import type Fuse from 'fuse.js'
import { map } from 'lodash/fp'
import type { codebook } from '@/data'

import fuse from '@/lib/fuse'

const search = fuse.search.bind(fuse)

export type CodebookEntry = (typeof codebook)[0]

export interface ColumnRequest extends WorkerRequest {
  columns: string[]
  method: 'get'
}

export interface ColumnResponse extends WorkerResponse {
  matches: Omit<Fuse.FuseResult<CodebookEntry>, 'matches'>[][]
}

type Handler = RequestHandler<ColumnRequest, ColumnResponse>

const get: Handler = ({ columns }) => ({
  matches: map(search)(columns),
  status: 'ok',
})

const controller: Controller<ColumnRequest, ColumnResponse> = {
  get,
}

const main = async (data: ColumnRequest) => {
  const { method } = data

  postMessage(await controller[method](data))
}

globalThis.addEventListener(
  'message',
  ({ data }: MessageEvent<ColumnRequest>) => {
    main(data).catch(console.error)
  },
  false,
)

globalThis.addEventListener('error', ({ error }) => {
  console.error(error)
})
