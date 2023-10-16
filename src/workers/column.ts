import type Fuse from 'fuse.js'
import { type ReadonlyNonEmptyArray, map } from 'fp-ts/ReadonlyNonEmptyArray'
import type { codebook } from '@/data'

import fuse from '@/lib/fuse'

const search = fuse.search.bind(fuse)

export type CodebookEntry = (typeof codebook)[0]

export interface ColumnRequest extends WorkerRequest {
  columns: ReadonlyNonEmptyArray<string>
  method: 'get'
}

export interface ColumnResponse extends WorkerResponse {
  matches: ReadonlyNonEmptyArray<
    Omit<Fuse.FuseResult<CodebookEntry>, 'matches'>[]
  >
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
    return undefined
  },
  false,
)

globalThis.addEventListener('error', ({ error }) => {
  console.error(error)
  return undefined
})
