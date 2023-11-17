/**
 * @file This file contains the visits selectors for the data slice.
 * @module selectors/data/visits
 */

import type { AppState } from '@/app/store'

import { getColParam } from '@/app/selectors'
import { arrayLookup, head } from '@/lib/array'
import { createSelector } from '@reduxjs/toolkit'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'

/**
 * Selector function to get the visits.
 * @param state - The application state {@link AppState}
 * @param state.data - The data slice of the state
 * @returns The visits that has been specified by the user
 * @example
 *  const getVisit = createSelector(
 *    [getVisits, getColParam],
 *    (visits, col) => arrayLookup(visits)('')(col),
 *  )
 */
export const getVisits = ({ data }: AppState) => data.visits

/**
 * This selector is used to get the visit at the given position in the visits array.
 * @param state - The application state {@link AppState}
 * @param col - The position in the visits array
 * @returns The visit at the given position in the visits array
 * @example
 *  const visit = useAppSelector(selectVisit(0))
 */
export const getVisit = createSelector(
  [getVisits, getColParam],
  (visits, col) => arrayLookup(visits)('')(col),
)

/**
 * This selector is used to get the first visit in the visits array.
 * @param state - The application state {@link app/store.AppState AppState}
 * @returns The first visit in the visits array
 * @example
 *  const firstVisit = useAppSelector(getFirstVisit)
 */
export const getFirstVisit = createSelector(
  [getVisits],
  f.flow(head, f.apply('')),
)

/**
 * This selector is used to get the length of the visits array.
 * @param state - The application state {@link app/store.AppState AppState}
 * @returns The length of the visits array
 * @example
 */
export const getVisitsLength = createSelector([getVisits], RA.size)
