import type { AppState } from '@/app/store'

import { getColParam } from '@/app/selectors'
import { arrayLookup } from '@/lib/array'
import { dualMap } from '@/lib/fp'
import { getVisits } from '@/selectors/data/visits'
import { createSelector } from '@reduxjs/toolkit'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'
import * as N from 'fp-ts/number'

/**
 *
 * @param state
 * @param state.matches
 * @returns
 * @example
 */
export const getMatchVisits = ({ matches }: AppState) => matches.visits

/**
 *
 */
export const getMatchVisit = createSelector(
  [getMatchVisits, getColParam],
  (matchVisits, pos) => arrayLookup(matchVisits)(0)(pos),
)

/**
 *
 */
export const getVisitByMatchVisit = createSelector(
  [getVisits, getMatchVisit],
  (visits, matchVisit) => arrayLookup(visits)('')(matchVisit),
)

/**
 *
 */
export const getResolvedVisits = createSelector(
  [getVisits, getMatchVisits],
  (visits, matchVisits) => RA.map(arrayLookup(visits)(''))(matchVisits),
)

/**
 *
 */
export const getVisitsComparer = createSelector(
  [getMatchVisits],
  (matchVisits) => (a: number, b: number) =>
    f.pipe(
      [a, b] as [number, number],
      dualMap(arrayLookup(matchVisits)(0)),
      f.tupled(N.Ord.compare),
    ),
)
