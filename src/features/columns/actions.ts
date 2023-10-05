import type { RootState } from '@/app/store'

import { createAsyncThunk } from '@reduxjs/toolkit'
import { promisedWorker } from '@/lib/utils'
import { columnWorker } from '@/app/workers'

import { getColumns } from '../sheet/selectors'

const messagePromise = () => promisedWorker('message', columnWorker)

export const name = 'columns' as const

export const fetchMatches = createAsyncThunk(
  `${name}/fetchMatches`,
  async (_, { getState }) => {
    const columns = getColumns(getState() as RootState)

    columnWorker.postMessage({
      columns: columns,
      method: 'get',
    })

    return (await messagePromise()).data.matches
  },
)
