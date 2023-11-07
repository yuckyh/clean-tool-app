import type { AppState } from '@/app/store'

import { getOriginalColumns } from '@/app/selectors'
import { columnWorker, promisedWorker } from '@/app/workers'
import { add } from '@/lib/fp/number'
import { createAsyncThunk } from '@reduxjs/toolkit'
import * as O from 'fp-ts/Option'
import * as f from 'fp-ts/function'

import { syncVisits } from '../sheet/reducers'

const messagePromise = f.pipe(
  ['message', columnWorker],
  f.tupled(promisedWorker),
  (p) => p.then(({ data }) => data),
  f.constant,
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
