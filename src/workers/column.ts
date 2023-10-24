import type Fuse from 'fuse.js'
import * as RA from 'fp-ts/ReadonlyArray'
import type { codebook } from '@/data'

import fuse from '@/lib/fuse'
import { dumpError } from '@/lib/logger'

const search = fuse.search.bind(fuse)

export type CodebookEntry = ArrayElement<typeof codebook>

export interface ColumnRequest extends WorkerRequest {
  columns: readonly string[]
  method: 'get'
}

export type ColumnResponse = WorkerResponse & {
  matches: readonly (readonly Omit<
    Fuse.FuseResult<CodebookEntry>,
    'matches'
  >[])[]
}

type Handler = RequestHandler<ColumnRequest, ColumnResponse>

const get: Handler = ({ columns }) => ({
  matches: RA.map(search)(columns),
  status: 'ok',
})

const controller: Controller<ColumnRequest, ColumnResponse> = {
  get,
}

const main = async (data: Readonly<ColumnRequest>) => {
  const { method } = data

  postMessage(await controller[method](data))
}

globalThis.addEventListener(
  'message',
  ({ data }: MessageEvent<ColumnRequest>) => {
    main(data).catch(dumpError)
    return undefined
  },
  false,
)

globalThis.addEventListener('error', ({ error }: ErrorEvent) => {
  dumpError(error as Error)
  return undefined
})
