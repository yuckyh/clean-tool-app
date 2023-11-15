/**
 * @file The file contains the selectors for the columns in the data slice.
 * @module selectors/data/columns
 */

import type { AppState } from '@/app/store'
import type * as CellItem from '@/lib/fp/CellItem'

import { getColParam } from '@/app/selectors'
import { arrayLookup, findIndex, head } from '@/lib/array'
import { typedIdentity } from '@/lib/fp'
import { createSelector } from '@reduxjs/toolkit'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as f from 'fp-ts/function'
import * as S from 'fp-ts/string'

import { getMatchColumns } from '../matches/columns'
import { getData } from './data'

/**
 * This selector is used to get the original columns in the data slice.
 * @param state - The application state {@link AppState}
 * @param state.data - The data slice of the application state {@link AppState.data data}
 * @returns
 * @example
 */
export const getOriginalColumns = ({ data }: AppState) => data.originalColumns

/**
 *
 */
export const getColumnsByData = createSelector(
  [getData],
  f.flow(
    RA.map(RR.keys),
    head,
    f.apply([] as readonly (keyof CellItem.CellItem)[]),
  ),
)

/**
 *
 */
export const getOriginalColumn = createSelector(
  [getOriginalColumns, getColParam],
  (originalColumns, pos) => arrayLookup(originalColumns)('')(pos),
)

/**
 *
 */
export const getPosAtEmptyList = createSelector(
  [getColumnsByData, getOriginalColumns],
  (dataColumns, originalColumns) =>
    f.pipe(
      originalColumns,
      RA.difference(S.Eq)(dataColumns),
      RA.map(findIndex(originalColumns)(S.Eq)),
    ),
)

/**
 *
 */
export const getEmptyColumns = createSelector(
  [getPosAtEmptyList, getMatchColumns],
  (posList, matchColumns) =>
    f.pipe(matchColumns, arrayLookup, f.apply(''), RA.map)(posList),
)

/**
 *
 */
export const getColumnsLength = createSelector([getOriginalColumns], RA.size)

/**
 *
 */
export const getColumnComparer = createSelector(
  [getOriginalColumns],
  (columns) => (posA: number, posB: number) =>
    f.pipe(
      [posA, posB] as const,
      f.pipe(columns, arrayLookup, f.apply(''), RA.map),
      typedIdentity<[string, string]>,
      f.tupled(S.Ord.compare),
    ),
)
