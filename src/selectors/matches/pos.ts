/**
 * @file This file contains the position selectors for the matches slice.
 */

import { getColumnParam, getVisitParam } from '@/app/selectors'
import { arrayLookup, head } from '@/lib/array'
import { equals, indexEq } from '@/lib/fp'
import { getVisits } from '@/selectors/data/visits'
import { createSelector } from '@reduxjs/toolkit'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'

import { getIndices } from './format'

/**
 * Utility function to search the position of the column and visit in the indices.
 * @param indices - The indices to search
 * @param visits - The visits to search
 * @param searchColumn - The column to search for
 * @param searchVisit - The visit to search for
 * @returns The position of the column and visit in the indices
 * @example
 *  const pos = searchPos(indices, visits, 'sno', '1')
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
    O.getOrElse(() => -1),
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
