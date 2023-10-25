import type { RootState } from '@/app/store'

import { getColumns } from '@/app/selectors'
import { columnWorker, promisedWorker } from '@/app/workers'
import { add } from '@/lib/number'
import { createAsyncThunk } from '@reduxjs/toolkit'
import * as O from 'fp-ts/Option'
import { constant, flow, pipe, tupled } from 'fp-ts/function'

import { syncVisits } from '../sheet/reducers'

const messagePromise = pipe(
  ['message', columnWorker],
  tupled(promisedWorker),
  (p) => p.then(({ data }) => data),
  constant,
)

export const sliceName = 'columns' as const

export const fetchMatches = createAsyncThunk(
  `${sliceName}/fetchMatches`,
  async (_, { dispatch, getState }) => {
    const columns = getColumns(getState() as RootState)

    columnWorker.postMessage({
      columns,
      method: 'get',
    })

    const result = (await messagePromise()).matches

    const { matchVisits } = (getState() as RootState).columns
    const { visits } = (getState() as RootState).sheet

    return pipe(
      matchVisits as number[],
      O.fromPredicate(
        (value) => value.length > 0 && Math.max(...value) > visits.length,
      ),
      O.map(
        flow(tupled(Math.max), add(1), syncVisits, dispatch, constant(result)),
      ),
      pipe(result, constant, O.getOrElse),
    )
  },
)
