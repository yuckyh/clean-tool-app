import { equals } from '@/lib/fp'
import { gt } from '@/lib/fp/number'
import { snakeToKebab } from '@/lib/fp/string'
import { createSelector } from '@reduxjs/toolkit'
import * as P from 'fp-ts/Predicate'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'
import * as N from 'fp-ts/number'

import {
  getMatchColumn,
  getMatchColumnDuplicates,
  getMatchColumns,
  getMatchColumnsDuplicates,
} from './columns'
import {
  getMatchVisit,
  getMatchVisits,
  getResolvedVisits,
  getVisitByMatchVisit,
} from './visits'

/**
 * Utility function to convert the column name to a path
 * @param shouldFormat - Whether the column should be formatted
 * @param column - The column to be converted
 * @param visit - The visit to be converted
 * @returns The converted column path
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
export const getIndices = createSelector(
  [getMatchColumns, getMatchVisits],
  RA.zip<string, number>,
)

/**
 *
 */
export const getResolvedIndices = createSelector(
  [getMatchColumns, getResolvedVisits],
  RA.zip<string, string>,
)

/**
 *
 */
const getShouldFormatList = createSelector(
  [getMatchVisits, getMatchColumnsDuplicates],
  (matchVisits, columnDuplicatesList) =>
    RA.zipWith(
      matchVisits,
      columnDuplicatesList,
      (matchVisit, columnDuplicates) =>
        f.pipe(columnDuplicates, RA.size, gt)(1) ||
        f.pipe(matchVisit, equals(N.Eq), P.not)(0),
    ),
)

/**
 *
 */
const getShouldFormat = createSelector(
  [getMatchVisit, getMatchColumnDuplicates],
  (matchVisit, columnDuplicates) =>
    f.pipe(columnDuplicates, RA.size, gt)(1) ||
    f.pipe(matchVisit, equals(N.Eq), P.not)(0),
)

/**
 *
 */
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
