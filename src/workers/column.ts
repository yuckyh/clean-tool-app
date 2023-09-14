import type {
  Controller,
  RequestHandler,
  WorkerRequest,
  WorkerResponse,
} from '.'
import Fuse from 'fuse.js'

export interface ColumnRequest extends WorkerRequest {
  method: 'get'
  list: string[]
  columns: string[]
  options?: Fuse.IFuseOptions<string>
}

export interface ColumnResponse extends WorkerResponse {
  columns: Fuse.FuseResult<string>[][]
}

type ColumnRequestHandler = RequestHandler<ColumnRequest, ColumnResponse>

const get: ColumnRequestHandler = async ({ list, columns, options }) => {
  const fuse = new Fuse(list, options)
  const search: Fuse<string>['search'] = (...args) => fuse.search(...args)

  const columnMatches = columns.map((column) => search(column))

  return Promise.resolve({
    action: 'get',
    columns: columnMatches,
  })
}

const controller: Controller<ColumnRequest, ColumnRequestHandler> = {
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
