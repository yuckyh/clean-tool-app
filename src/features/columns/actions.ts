import { createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'

import { just } from '@/lib/monads'
import { promisedWorker, columnWorker } from '@/app/workers'
import { getColumns } from '@/app/selectors'

import { syncVisits } from '../sheet/reducers'

const messagePromise = async () =>
  (await promisedWorker('message', columnWorker)).data

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

    if (matchVisits.length) {
      const newVisitsLength = Math.max(...matchVisits) + 1

      just(newVisitsLength)(syncVisits)(dispatch)
    }

    return result
  },
)
