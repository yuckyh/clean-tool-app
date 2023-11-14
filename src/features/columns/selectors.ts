/**
 * @file The file contains the selectors for the columns slice.
 * @module features/columns/selectors
 */

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
} from '@/app/selectors'
import { arrayLookup, findIndex, head } from '@/lib/array'
import { dualMap, equals, indexEq } from '@/lib/fp'
import { add, multiply } from '@/lib/fp/number'
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

/**
 *
 */
const search = fuse.search.bind(fuse)

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
 * @param shouldFormat
 * @param column
 * @param visit
 * @returns
 * @example
 */
const pathColumn = (shouldFormat: boolean, column: string, visit: string) =>
  `/eda/${snakeToKebab(column)}${shouldFormat ? `/${visit}` : ''}`

/**
 *
 * @param shouldFormat
 * @param column
 * @param visit
 * @returns
 * @example
 */
const formatColumn = (shouldFormat: boolean, column: string, visit: string) =>
  shouldFormat ? `${column}_${visit}` : column

/**
 *
 */
export const getMatchVisit = createSelector(
  [getMatchVisits, getColParam],
  /**
   *
   * @param matchVisits
   * @param pos
   * @returns
   * @example
   */
  (matchVisits, pos) => arrayLookup(matchVisits)(0)(pos),
)

/**
 *
 */
export const getMatches = createSelector(
  [getMatchesList, getColParam],
  /**
   *
   * @param matchesList
   * @param pos
   * @returns
   * @example
   */
  (matchesList, pos) => arrayLookup(matchesList)([] as readonly string[])(pos),
)

/**
 *
 */
export const getScores = createSelector(
  [getScoresList, getColParam],
  /**
   *
   * @param scoresList
   * @param pos
   * @returns
   * @example
   */
  (scoresList, pos) => arrayLookup(scoresList)([] as readonly number[])(pos),
)

/**
 *
 */
export const getVisitByMatchVisit = createSelector(
  [getVisits, getMatchVisit],
  /**
   *
   * @param visits
   * @param matchVisit
   * @returns
   * @example
   */
  (visits, matchVisit) => arrayLookup(visits)('')(matchVisit),
)

/**
 *
 */
const getShouldFormat = createSelector(
  [getMatchVisit, getColumnDuplicates],
  /**
   *
   * @param matchVisit
   * @param columnDuplicates
   * @returns
   * @example
   */
  (matchVisit, columnDuplicates) =>
    columnDuplicates.length > 1 || P.not(equals(N.Eq)(matchVisit))(0),
)

const getShouldFormatList = createSelector(
  [getMatchVisits, getColumnDuplicatesList],
  /**
   *
   * @param matchVisits
   * @param columnDuplicatesList
   * @returns
   * @example
   */
  (matchVisits, columnDuplicatesList) =>
    RA.zipWith(
      matchVisits,
      columnDuplicatesList,
      (matchVisit, columnDuplicates) =>
        columnDuplicates.length > 1 || matchVisit !== 0,
    ),
)

/**
 *
 */
export const getIndices = createSelector(
  [getMatchColumns, getMatchVisits],
  RA.zip<string, number>,
)
/**
 *
 */
const getResolvedVisits = createSelector(
  [getVisits, getMatchVisits],
  /**
   *
   * @param visits
   * @param matchVisits
   * @returns
   * @example
   */
  (visits, matchVisits) => RA.map(arrayLookup(visits)(''))(matchVisits),
)

/**
 *
 */
const getResolvedIndices = createSelector(
  [getMatchColumns, getResolvedVisits],
  RA.zip<string, string>,
)

/**
 *
 */
export const getColumnPaths = createSelector(
  [getResolvedIndices, getShouldFormatList],
  /**
   *
   * @param resolvedIndices
   * @param shouldFormatList
   * @returns
   * @example
   */
  (resolvedIndices, shouldFormatList) =>
    RA.zipWith(
      resolvedIndices,
      shouldFormatList,
      ([column, visit], shouldFormat) =>
        pathColumn(shouldFormat, column, visit),
    ),
)

/**
 *
 */
export const getColumnPath = createSelector(
  [getShouldFormat, getMatchColumn, getVisitByMatchVisit],
  pathColumn,
)

/**
 *
 */
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

/**
 *
 */
export const getFormattedColumn = createSelector(
  [getShouldFormat, getMatchColumn, getVisitByMatchVisit],
  formatColumn,
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
  /**
   *
   * @param indices
   * @param visits
   * @returns
   * @example
   */
  (indices, visits) => searchPos(indices, visits, 'sno', head(visits)('')),
)

/**
 *
 */
export const getMatchIndex = createSelector(
  [getMatches, getMatchColumn],
  (matches, matchColumn) => findIndex(matches)(S.Eq)(matchColumn),
)

/**
 *
 */
export const getDataType = createSelector(
  [getDataTypes, getColParam],
  /**
   *
   * @param dataTypes
   * @param pos
   * @returns
   * @example
   */
  (dataTypes, pos) => arrayLookup(dataTypes)('none')(pos),
)

/**
 *
 */
export const getSearchedDataType = createSelector(
  [getDataTypes, getSearchedPos],
  /**
   *
   * @param dataTypes
   * @param pos
   * @returns
   * @example
   */
  (dataTypes, pos) => arrayLookup(dataTypes)('none')(pos),
)

/**
 *
 */
export const getScore = createSelector(
  [getMatchIndex, getMatchColumn, getScores],
  /**
   *
   * @param matchIndex
   * @param matchColumn
   * @param scores
   * @returns
   * @example
   */
  (matchIndex, matchColumn, scores) =>
    f
      .pipe(
        f.pipe(matchColumn, search, ([match]) => match?.score ?? 1),
        arrayLookup(scores),
        f.apply(matchIndex),
        multiply(-1),
        add(1),
      )
      .toFixed(2),
)

/**
 *
 */
export const getMatchComparer = createSelector(
  [getMatchColumns],
  /**
   *
   * @param matchColumns
   * @returns
   * @example
   */
  (matchColumns) => (a: number, b: number) =>
    f.pipe(
      [a, b] as [number, number],
      dualMap(arrayLookup(matchColumns)('')),
      f.tupled(S.Ord.compare),
    ),
)

/**
 *
 */
export const getVisitsComparer = createSelector(
  [getMatchVisits],
  /**
   *
   * @param matchVisits
   * @returns
   * @example
   */
  (matchVisits) => (a: number, b: number) =>
    f.pipe(
      [a, b] as [number, number],
      dualMap(arrayLookup(matchVisits)(0)),
      f.tupled(N.Ord.compare),
    ),
)

/**
 *
 */
export const getScoreComparer = createSelector(
  [getMatchesList, getScoresList, getMatchColumns],
  /**
   *
   * @param matchesList
   * @param scoresList
   * @param matchColumns
   * @returns
   * @example
   */
  (matchesList, scoresList, matchColumns) => (a: number, b: number) =>
    f.pipe(
      [a, b] as [number, number],
      dualMap(
        f.pipe(
          scoresList,
          RA.zip(matchesList),
          RA.zip(matchColumns),
          RA.map(([[scores, matches], matchColumn]) =>
            arrayLookup(scores)(1)(findIndex(matches)(S.Eq)(matchColumn)),
          ),
          arrayLookup,
        )(1),
      ),
      f.tupled(N.Ord.compare),
    ),
)
