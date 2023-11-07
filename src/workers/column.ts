import type { codebook } from '@/data'
import type Fuse from 'fuse.js'

import { dumpError } from '@/lib/fp/logger'
import fuse from '@/lib/fuse'
import * as RA from 'fp-ts/ReadonlyArray'

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

const controller: Readonly<Controller<ColumnRequest, ColumnResponse>> = {
  get,
}

const main = async (data: Readonly<ColumnRequest>) => {
  const { method } = data

  postMessage(await controller[method](data))
}

globalThis.addEventListener(
  'message',
  ({ data }: Readonly<MessageEvent<ColumnRequest>>) => {
    main(data).catch(dumpError)
    return undefined
  },
  false,
)

globalThis.addEventListener('error', ({ error }: Readonly<ErrorEvent>) => {
  dumpError(error as Error)
  return undefined
})
