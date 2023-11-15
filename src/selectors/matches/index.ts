import { getColumnParam, getVisitParam } from '@/app/selectors'
import { arrayLookup, head } from '@/lib/array'
import { equals, indexEq } from '@/lib/fp'
import { createSelector } from '@reduxjs/toolkit'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'

import { getVisits } from '../data/visits'
import { getIndices } from './format'

/**
 *
 * @param indices
 * @param visits
 * @param searchColumn
 * @param searchVisit
 * @returns
 * @example
 */
const searchPos = (
  indices: readonly (readonly [string, number])[],
  visits: readonly string[],
  searchColumn: string,
  searchVisit: string,
) =>
  f.pipe(
    indices,
    RA.findIndex(([matchColumn, matchVisit]) =>
      equals(indexEq)([searchColumn, searchVisit])([
        matchColumn,
        arrayLookup(visits)('')(matchVisit),
      ]),
    ),
    O.getOrElse(f.constant(-1)),
  )

/**
 *
 */
export const getSearchedPos = createSelector(
  [getIndices, getVisits, getColumnParam, getVisitParam],
  searchPos,
)

/**
 *
 */
export const getIndexColumnPos = createSelector(
  [getIndices, getVisits],
  (indices, visits) => searchPos(indices, visits, 'sno', head(visits)('')),
)
