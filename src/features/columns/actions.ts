import type { AppState } from '@/app/store'
import type { ColumnResponse } from '@/workers/column'
import type * as T from 'fp-ts/Task'

import { getOriginalColumns } from '@/app/selectors'
import { columnWorker } from '@/app/workers'
import { dumpError } from '@/lib/fp/logger'
import { add } from '@/lib/fp/number'
import { promisedWorker } from '@/lib/utils'
import { createAsyncThunk } from '@reduxjs/toolkit'
import * as O from 'fp-ts/Option'
import * as TE from 'fp-ts/TaskEither'
import * as f from 'fp-ts/function'

import { syncVisits } from '../sheet/reducers'

const messagePromise: T.Task<ColumnResponse<'fail'> | ColumnResponse<'ok'>> =
  f.pipe(
    TE.tryCatch(() => promisedWorker('message', columnWorker), dumpError),
    TE.matchW(
      () =>
        ({
          error: new Error('columnWorker failed'),
          status: 'fail',
        }) as ColumnResponse<'fail'>,
      ({ data }) => data as ColumnResponse<'ok'>,
    ),
  )

export const sliceName = 'columns' as const

export const fetchMatches = createAsyncThunk(
  `${sliceName}/fetchMatches`,
  async (_, { dispatch, getState }) => {
    const columns = getOriginalColumns(getState() as AppState)

    columnWorker.postMessage({
      columns,
      method: 'get',
    })

    const result = (await messagePromise()).matches

    const { matchVisits } = (getState() as AppState).columns
    const { visits } = (getState() as AppState).sheet

    return f.pipe(
      matchVisits as number[],
      O.fromPredicate(
        (value) => value.length > 0 && Math.max(...value) > visits.length,
      ),
      O.map(
        f.flow(
          f.tupled(Math.max),
          add(1),
          syncVisits,
          dispatch,
          f.constant(result),
        ),
      ),
      f.pipe(result, f.constant, O.getOrElse),
    )
  },
)
