/**
 * @file This file contains the matches actions.
 * @module actions/matches
 */

import type { AppState } from '@/app/store'
import type { ColumnRequest, ColumnResponse } from '@/workers/column'
import type * as T from 'fp-ts/Task'

import { columnWorker, createHandledTask } from '@/app/workers'
import { add } from '@/lib/fp/number'
import { getOriginalColumns } from '@/selectors/data/columns'
import { createAsyncThunk } from '@reduxjs/toolkit'
import * as O from 'fp-ts/Option'
import * as f from 'fp-ts/function'

import { syncVisits } from '../reducers/data'

const handledTask: T.Task<ColumnResponse> = createHandledTask<
  ColumnRequest,
  ColumnResponse
>(columnWorker, 'columnWorker failed')

/**
 * The name of the slice.
 */
export const sliceName = 'matches' as const

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
  async (_, { getState }) => {
    const columns = getOriginalColumns(getState() as AppState)

    columnWorker.postMessage({
      columns,
      method: 'get',
    })

    return (await handledTask()).matches
  },
)
