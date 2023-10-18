import { createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'

import { promisedWorker, columnWorker } from '@/app/workers'
import { getColumns } from '@/app/selectors'

import { constant, tupled, pipe } from 'fp-ts/function'
import type { Either } from 'fp-ts/Either'
import { getOrElse, right, left } from 'fp-ts/Either'
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

    const result = (await messagePromise()).matches

    const { matchVisits } = (getState() as RootState).columns

    return pipe(
      matchVisits,
      (value): Either<typeof value, typeof result> =>
        value.length > 0 ? left(value) : right(result),
      getOrElse((value) =>
        pipe(Math.max(...value) + 1, syncVisits, dispatch, () => result),
      ),
    )
  },
)
