import {
  getColParam,
  getMatchColumns,
  getOriginalColumns,
} from '@/app/selectors'
import { arrayLookup, indexDuplicateSearcher } from '@/lib/array'
import { length, typedIdentity } from '@/lib/fp'
import { createSelector } from '@reduxjs/toolkit'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'
import * as S from 'fp-ts/string'

export const getOriginalColumn = createSelector(
  [getOriginalColumns, getColParam],
  (columns, pos) => arrayLookup(columns)('')(pos),
)

export const getMatchColumn = createSelector(
  [getMatchColumns, getColParam],
  (matchColumns, pos) => arrayLookup(matchColumns)('')(pos),
)

export const getColumnsLength = createSelector([getOriginalColumns], length)

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

export const getColumnDuplicates = createSelector(
  [getMatchColumns, getMatchColumn],
  (matchColumns, matchColumn) =>
    indexDuplicateSearcher(f.pipe(matchColumns, RA.map(RA.of)), [matchColumn]),
)

export const getColumnDuplicatesList = createSelector(
  [getMatchColumns],
  (matchColumns) =>
    f.pipe(
      matchColumns,
      RA.map((matchColumn) =>
        indexDuplicateSearcher(f.pipe(matchColumns, RA.map(RA.of)), [
          matchColumn,
        ]),
      ),
    ),
)
