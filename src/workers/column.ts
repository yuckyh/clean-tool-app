/**
 * @file This file contains the column worker's controller.
 */

import type { codebook } from '@/data'
import type * as Fuse from 'fuse.js'

import { dumpError } from '@/lib/fp/logger'
import { search } from '@/lib/fuse'
import * as RA from 'fp-ts/ReadonlyArray'

/**
 * The type of the {@link codebook} entries.
 * @example
 * ```ts
 *  const entry: CodebookEntry = {
 *    category: 'quux',
 *    description: 'baz',
 *    name: 'foo',
 *    type: 'bar',
 *    unit: 'qux',
 *  }
 * ```
 */
export type CodebookEntry = ArrayElement<typeof codebook>
type MatchlessFuseResult = Omit<Fuse.FuseResult<CodebookEntry>, 'matches'>

/**
 * The type of the worker's request.
 * @example
 * ```ts
 *  const request: ColumnRequest = {
 *    columns: ['foo', 'foo2'],
 *    method: 'get',
 *  }
 * ```
 */
export type ColumnRequest = {
  /**
   * The columns to search.
   */
  columns: readonly string[]
} & WorkerRequest<'get'>

type ColumnOkResponse = WorkerResponse<'get', 'ok'> & {
  /**
   * The search results.
   */
  matches: readonly (readonly MatchlessFuseResult[])[]
}

/**
 * The type of the worker's response.
 * @example
 * ```ts
 * const response: ColumnResponse = {
 *   matches: [
 *     [
 *       {
 *         item: {
 *           category: 'quux',
 *           description: 'baz',
 *           name: 'foo',
 *           type: 'bar',
 *           unit: 'qux',
 *         },
 *         refIndex: 0,
 *         score: 0.5,
 *       },
 *       {
 *         item: {
 *           category: 'quux',
 *           description: 'baz2',
 *           name: 'foo2',
 *           type: 'bar',
 *           unit: 'qux',
 *         },
 *         refIndex: 1,
 *         score: 0.4,
 *       },
 *     ],
 *     [
 *       {
 *         item: {
 *           category: 'quux',
 *           description: 'baz',
 *           name: 'foo2',
 *           type: 'bar',
 *           unit: 'qux',
 *         },
 *         refIndex: 1,
 *         score: 0.5,
 *       },
 *     ],
 *   ],
 *   status: 'ok',
 * }
 * ```
 */
export type ColumnResponse<S extends ResponseStatus = ResponseStatus> =
  WorkerResponse<'get', S> & ColumnOkResponse

/**
 * The type of the worker's handler.
 */
type Handler = RequestHandler<ColumnRequest, ColumnResponse>

/**
 * The function to get the search results.
 * @param request - The {@link ColumnRequest request} for the function.
 * @param request.columns - The columns to search.
 * @param request.method - The request's method that was sent.
 * @returns The {@link ColumnResponse response} for the function.
 * @example
 *  const response = get({ columns: ['foo', 'foo2'], method: 'get' })
 */
const get: Handler = ({ columns, method }) => ({
  matches: RA.map(search)(columns),
  method,
  status: 'ok',
})

/**
 * The controller for the worker.
 */
const controller: Readonly<Controller<ColumnRequest, ColumnResponse>> = {
  get,
}

/**
 * The main function for the worker.
 * @param data - The {@link ColumnRequest request} for the function.
 * @returns The {@link ColumnResponse response} for the function.
 * @example
 *  const response = main({ columns: ['foo', 'foo2'], method: 'get' })
 */
const main = async (data: Readonly<ColumnRequest>) => {
  const { method } = data

  postMessage(await controller[method](data))
}

globalThis.addEventListener(
  'message',
  ({ data }: Readonly<MessageEvent<ColumnRequest>>) => {
    main(data).catch(dumpError)
  },
  false,
)

globalThis.addEventListener('error', ({ error }: Readonly<ErrorEvent>) => {
  dumpError(error as Error)
})
