/**
 * @file This file contains the selectors for the columns in the matches slice.
 * @module selectors/matches
 */

import type { AppState } from '@/app/store'

import { getColParam } from '@/app/selectors'
import { arrayLookup, indexDuplicateSearcher } from '@/lib/array'
import { dualMap } from '@/lib/fp'
import { createSelector } from '@reduxjs/toolkit'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'
import * as S from 'fp-ts/string'

/**
 * Selector function to get the match columns
 * @param state - The {@link AppState application state}
 * @param state.matches - The matches slice of the state
 * @returns The match columns
 * @example
 *  const matchColumns = useAppSelector(getMatchColumns)
 */
export const getMatchColumns = ({ matches }: AppState) => matches.columns

/**
 * The selector to get the match column
 * @param _state - The {@link AppState application state}
 * @param pos - The column position parameter
 * @returns The match column
 * @example
 *  const matchColumn = useAppSelector(selectMatchColumn(pos))
 */
export const getMatchColumn = createSelector(
  [getMatchColumns, getColParam],
  (matchColumns, pos) => arrayLookup(matchColumns)('')(pos),
)

/**
 *
 */
export const getMatchColumnDuplicates = createSelector(
  [getMatchColumns, getMatchColumn],
  (matchColumns, matchColumn) =>
    indexDuplicateSearcher(RA.map(RA.of)(matchColumns), [matchColumn]),
)

/**
 *
 */
export const getMatchColumnsDuplicates = createSelector(
  [getMatchColumns],
  (matchColumns) =>
    f.pipe(
      matchColumns,
      RA.map((matchColumn) =>
        indexDuplicateSearcher(RA.map(RA.of)(matchColumns), [matchColumn]),
      ),
    ),
)

/**
 *
 */
export const getMatchColumnsComparer = createSelector(
  [getMatchColumns],
  (matchColumns) => (a: number, b: number) =>
    f.pipe(
      [a, b] as [number, number],
      dualMap(arrayLookup(matchColumns)('')),
      f.tupled(S.Ord.compare),
    ),
)
