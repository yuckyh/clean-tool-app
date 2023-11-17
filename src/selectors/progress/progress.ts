/**
 * @file This file contains the progress selectors for the progress slice.
 * @module selectors/progress
 */

import type { Progress } from '@/reducers/progress'

import { arrayLookup, recordLookup } from '@/lib/array'
import { createSelector } from '@reduxjs/toolkit'
import * as P from 'fp-ts/Predicate'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as f from 'fp-ts/function'
import * as S from 'fp-ts/string'

import { getProgress } from '.'
import { getLocationPathWords, getPath, getPaths } from './paths'

/**
 * Selector function to get the allowed paths
 * @param state - The application state {@link app/store.AppState AppState}
 * @param componentPath - The progress nav's component path in the router.
 * @returns The allowed paths.
 * @example
 * ```tsx
 *  const allowedPaths = useAppSelector(getAllowedPaths)
 * ```
 */
export const getAllowedPaths = createSelector(
  [getPaths, getProgress],
  (paths, progress) =>
    f.pipe(
      ['none', 'uploaded', 'matched', 'explored'] as Progress[],
      RA.mapWithIndex((i, p) => [p, RA.takeLeft(i + 2)(paths)] as const),
      RR.fromEntries,
      recordLookup,
    )([])(progress),
)

/**
 * Selector function to get whether the current path is disabled.
 * @param state - The application state {@link app/store.AppState AppState}
 * @param componentPath - The progress nav's component path in the router.
 * @param locationPath - The current location path.
 * @returns Whether the current path is disabled.
 * @example
 * ```tsx
 *  const isDisabled = useAppSelector(getIsDisabled)
 * ```
 */
export const getIsDisabled = createSelector(
  [getPath, getAllowedPaths],
  (path, allowedPaths) => P.not(RA.elem(S.Eq)(path))(allowedPaths),
)

/**
 * Selector function to get whether the user should be navigated to the allowed path.
 * @param state - The application state {@link app/store.AppState AppState}
 * @param componentPath - The progress nav's component path in the router.
 * @param locationPath - The current location path.
 * @returns Whether the user should be navigated to the allowed path.
 * @example
 * ```tsx
 *  const shouldNavigateToAllowed = useAppSelector(getShouldNavigateToAllowed)
 * ```
 */
export const getShouldNavigateToAllowed = createSelector(
  [getLocationPathWords, getAllowedPaths],
  (locationPathWords, allowedPaths) =>
    f.pipe(
      allowedPaths,
      RA.every(
        f.flow(
          S.replace('/', ''),
          f.pipe(arrayLookup(locationPathWords)('')(0), S.includes, P.not),
        ),
      ),
    ),
)
