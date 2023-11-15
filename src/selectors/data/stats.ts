import { arrayLookup, getIndexedValue } from '@/lib/array'
import { add, divideBy, multiply } from '@/lib/fp/number'
import { createSelector } from '@reduxjs/toolkit'
import * as E from 'fp-ts/Either'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'
import * as N from 'fp-ts/number'

import { getIndexedNumericalRow, getSortedNumericalRow } from './rows'

/**
 *
 */
const getFences = createSelector([getSortedNumericalRow], (row) =>
  f.pipe(
    RA.makeBy(
      3,
      f.flow(
        add(1),
        multiply(row.length),
        divideBy,
        f.apply(4),
        E.fromPredicate((x) => x % 1 === 0, f.identity),
        E.getOrElse(Math.ceil),
        (x) => [x - 1, x] as const,
        RA.foldMap(N.MonoidSum)(arrayLookup(row)(0)),
        f.flip(divideBy)(2),
      ),
    ) as readonly [number, number, number],
    ([q1, , q3]) => [2.5 * q1 - 1.5 * q3, 2.5 * q3 - 1.5 * q1] as const,
  ),
)

/**
 *
 */
export const getOutliers = createSelector(
  [getIndexedNumericalRow, getFences],
  (row, [lower, upper]) =>
    f.pipe(
      row,
      RA.filter(([, value]) => value < lower || value > upper),
    ),
)

/**
 * Function to select non outlier values from the given indexed numerical row.
 * @param state - The application state {@link app/store.AppState AppState}
 * @param column - The column to search for the row
 * @param visit - The visit to search for the row
 * @returns - An array of non outlier values
 */
export const getNotOutliers = createSelector(
  [getIndexedNumericalRow, getFences],
  (row, [lower, upper]) =>
    f.pipe(
      row,
      RA.filter(
        f.flow(getIndexedValue, (value) => value > lower && value < upper),
      ),
    ),
)
