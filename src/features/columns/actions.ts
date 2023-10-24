import { createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'

import { promisedWorker, columnWorker } from '@/app/workers'
import { getColumns, getData } from '@/app/selectors'

import { constant, tupled, pipe, flow } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { add } from '@/lib/number'
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
  async (_, { getState, dispatch }) => {
    const columns = getColumns(getState() as RootState)

    columnWorker.postMessage({
      method: 'get',
      columns,
    })

    const data = getData(getState() as RootState)

    const result = (await messagePromise()).matches

    const { matchVisits } = (getState() as RootState).columns

    return pipe(
      matchVisits as number[],
      O.fromPredicate((value) => value.length > 0),
      O.map(
        flow(tupled(Math.max), add(1), syncVisits, dispatch, constant(result)),
      ),
      pipe(result, constant, O.getOrElse),
    )
  },
)
