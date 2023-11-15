import type { AppState } from '@/app/store'
import type { ColumnRequest, ColumnResponse } from '@/workers/column'
import type * as T from 'fp-ts/Task'

import { getOriginalColumns } from '@/app/selectors'
import { columnWorker, createHandledTask } from '@/app/workers'
import { add } from '@/lib/fp/number'
import { createAsyncThunk } from '@reduxjs/toolkit'
import * as O from 'fp-ts/Option'
import * as f from 'fp-ts/function'

import { syncVisits } from '../sheet/reducers'

const handledTask: T.Task<ColumnResponse> = createHandledTask<
  ColumnRequest,
  ColumnResponse
>(columnWorker, 'columnWorker failed')

/**
 * The name of the slice.
 */
export const sliceName = 'columns' as const

/**
 * The thunk to fetch the matches.
 * @returns A promise containing the matches.
 * @example
 * ```ts
 *    dispatch(fetchMatches())
 * ```
 */
export const fetchMatches = createAsyncThunk(
  `${sliceName}/fetchMatches`,
  async (_, { dispatch, getState }) => {
    const columns = getOriginalColumns(getState() as AppState)

    columnWorker.postMessage({
      columns,
      method: 'get',
    })

    const result = (await handledTask()).matches

    const { matchVisits } = (getState() as AppState).columns
    const { visits } = (getState() as AppState).sheet

    return f.pipe(
      matchVisits as number[],
      O.fromPredicate(
        (value) => value.length > 0 && Math.max(...value) > visits.length,
      ),
      O.map(f.flow(f.tupled(Math.max), add(1), syncVisits, dispatch)),
      O.match(
        () => result,
        () => result,
      ),
    )
  },
)
