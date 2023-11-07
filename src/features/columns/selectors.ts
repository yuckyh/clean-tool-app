import {
  getColParam,
  getColumnParam,
  getDataTypes,
  getMatchColumns,
  getMatchVisits,
  getMatchesList,
  getScoresList,
  getVisitParam,
  getVisits,
  indexEq,
} from '@/app/selectors'
import { arrLookup, findIndex, head } from '@/lib/array'
import { dualMap, equals } from '@/lib/fp'
import { snakeToKebab } from '@/lib/fp/string'
import fuse from '@/lib/fuse'
import {
  getColumnDuplicates,
  getColumnDuplicatesList,
  getMatchColumn,
} from '@/selectors/columns/selectors'
import { createSelector } from '@reduxjs/toolkit'
import * as O from 'fp-ts/Option'
import * as P from 'fp-ts/Predicate'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'
import * as N from 'fp-ts/number'
import * as S from 'fp-ts/string'

import type { DataType } from './reducers'

import { getFirstVisit } from '../sheet/selectors'

const search = fuse.search.bind(fuse)

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
        arrLookup(visits)('')(matchVisit),
      ]),
    ),
    O.getOrElse(f.constant(-1)),
  )

const pathColumn = (shouldFormat: boolean, column: string, visit: string) =>
  `/eda/${snakeToKebab(column)}${shouldFormat ? `/${visit}` : ''}`

const formatColumn = (shouldFormat: boolean, column: string, visit: string) =>
  shouldFormat ? `${column}_${visit}` : column

export const getMatchVisit = createSelector(
  [getMatchVisits, getColParam],
  (matchVisits, pos) => arrLookup(matchVisits)(0)(pos),
)

export const getMatches = createSelector(
  [getMatchesList, getColParam],
  (matchesList, pos) => arrLookup(matchesList)([] as readonly string[])(pos),
)

export const getScores = createSelector(
  [getScoresList, getColParam],
  (scoresList, pos) => arrLookup(scoresList)([] as readonly number[])(pos),
)

export const getVisitByMatchVisit = createSelector(
  [getVisits, getMatchVisit],
  (visits, matchVisit) => arrLookup(visits)('')(matchVisit),
)

const getShouldFormat = createSelector(
  [getMatchVisit, getColumnDuplicates],
  (matchVisit, columnDuplicates) =>
    columnDuplicates.length > 1 || P.not(equals(N.Eq)(matchVisit))(0),
)

const getShouldFormatList = createSelector(
  [getMatchVisits, getColumnDuplicatesList],
  (matchVisits, columnDuplicatesList) =>
    RA.zipWith(
      matchVisits,
      columnDuplicatesList,
      (matchVisit, columnDuplicates) =>
        columnDuplicates.length > 1 || matchVisit !== 0,
    ),
)

export const getIndices = createSelector(
  [getMatchColumns, getMatchVisits],
  RA.zip<string, number>,
)

const getResolvedVisits = createSelector(
  [getVisits, getMatchVisits],
  (visits, matchVisits) => RA.map(arrLookup(visits)(''))(matchVisits),
)

const getResolvedIndices = createSelector(
  [getMatchColumns, getResolvedVisits],
  RA.zip<string, string>,
)

export const getColumnPaths = createSelector(
  [getResolvedIndices, getShouldFormatList],
  (resolvedIndices, shouldFormatList) =>
    RA.zipWith(
      resolvedIndices,
      shouldFormatList,
      ([column, visit], shouldFormat) =>
        pathColumn(shouldFormat, column, visit),
    ),
)

export const getColumnPath = createSelector(
  [getShouldFormat, getMatchColumn, getVisitByMatchVisit],
  pathColumn,
)

export const getFormattedColumns = createSelector(
  [getResolvedIndices, getShouldFormatList],
  (resolvedIndices, shouldFormatList) =>
    RA.zipWith(
      resolvedIndices,
      shouldFormatList,
      ([column, visit], shouldFormat) =>
        formatColumn(shouldFormat, column, visit),
    ),
)

export const getFormattedColumn = createSelector(
  [getShouldFormat, getMatchColumn, getVisitByMatchVisit],
  formatColumn,
)

export const getSearchedPos = createSelector(
  [getIndices, getVisits, getColumnParam, getVisitParam],
  searchPos,
)

export const getIndexColumnPos = createSelector(
  [getIndices, getVisits],
  (indices, visits) => searchPos(indices, visits, 'sno', head(visits)('')),
)

export const getMatchIndex = createSelector(
  [getMatches, getMatchColumn],
  (matches, matchColumn) => findIndex(matches)(S.Eq)(matchColumn),
)

export const getDataType = createSelector(
  [getDataTypes, getColParam],
  (dataTypes, pos) => arrLookup(dataTypes)('none')(pos),
)

export const getSearchedDataType = createSelector(
  [getDataTypes, getSearchedPos],
  (dataTypes, pos) =>
    f.pipe(
      dataTypes,
      RA.lookup(pos),
      f.pipe('' as DataType, f.constant, O.getOrElse),
    ),
)

export const getScore = createSelector(
  [getMatchIndex, getMatchColumn, getScores],
  (matchIndex, matchColumn, scores) =>
    (
      1 -
      (scores[matchIndex] ??
        f.pipe(matchColumn, search, ([match]) => match?.score ?? 1))
    ).toFixed(2),
)

export const getMatchComparer = createSelector(
  [getMatchColumns],
  (matchColumns) => (a: number, b: number) =>
    f.pipe(
      [a, b] as [number, number],
      dualMap(arrLookup(matchColumns)('')),
      f.tupled(S.Ord.compare),
    ),
)

export const getVisitsComparer = createSelector(
  [getMatchVisits],
  (matchVisits) => (a: number, b: number) =>
    f.pipe(
      [a, b] as [number, number],
      dualMap(arrLookup(matchVisits)(0)),
      f.tupled(N.Ord.compare),
    ),
)

export const getScoreComparer = createSelector(
  [getMatchesList, getScoresList, getMatchColumns],
  (matchesList, scoresList, matchColumns) => (a: number, b: number) =>
    f.pipe(
      [a, b] as [number, number],
      dualMap(
        f.pipe(
          scoresList,
          RA.zip(matchesList),
          RA.zip(matchColumns),
          RA.map(([[scores, matches], matchColumn]) =>
            arrLookup(scores)(1)(findIndex(matches)(S.Eq)(matchColumn)),
          ),
          arrLookup,
          f.apply(1),
        ),
      ),
      f.tupled(N.Ord.compare),
    ),
)
