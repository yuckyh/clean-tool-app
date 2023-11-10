import type { AppState } from '@/app/store'
import type { RouteObject } from 'react-router-dom'

import { routes } from '@/app/Router'
import { getProgress } from '@/app/selectors'
import { arrayLookup, findIndex, recordLookup } from '@/lib/array'
import { equals } from '@/lib/fp'
import { getPathTitle } from '@/lib/fp/string'
import { createSelector } from '@reduxjs/toolkit'
import * as O from 'fp-ts/Option'
import * as P from 'fp-ts/Predicate'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as f from 'fp-ts/function'
import * as N from 'fp-ts/number'
import * as S from 'fp-ts/string'
import { matchRoutes, resolvePath } from 'react-router-dom'

import type { Progress } from './reducers'

/**
 *
 * @param _
 * @param _1
 * @param locationPath
 * @returns
 * @example
 */
const getLocationPathParam = (_: AppState, _1: string, locationPath: string) =>
  locationPath

/**
 *
 * @param _
 * @param componentPath
 * @returns
 * @example
 */
const getComponentPathParam = (_: AppState, componentPath: string) =>
  componentPath

/**
 *
 * @param _
 * @param _1
 * @param _2
 * @param pos
 * @returns
 * @example
 */
const getPosParam = (_: AppState, _1: string, _2: string, pos: number) => pos

/**
 *
 */
export const getLocationPathWords = createSelector(
  [getLocationPathParam],
  f.flow(S.split('/'), f.pipe(S.isEmpty, P.not, RA.filter<string>)),
)

/**
 *
 */
export const getPaths = createSelector(
  [getComponentPathParam],
  f.flow(
    (path) => [routes, path] as [RouteObject[], string],
    f.tupled(matchRoutes),
    O.fromNullable,
    O.flatMap(RA.findFirst(({ route }) => !route.index)),
    O.flatMap(({ route }) => O.fromNullable(route.children)),
    O.flatMap(RA.findFirst(({ index }) => !index)),
    O.flatMap(({ children }) => O.fromNullable(children)),
    O.map(
      RA.map(({ path }) =>
        f.pipe(
          path,
          O.fromNullable,
          O.map(resolvePath),
          O.map(({ pathname }) => pathname.toLowerCase()),
          O.getOrElse(() => ''),
        ),
      ),
    ),
    O.getOrElse(() => [] as readonly string[]),
  ),
)

const getPath = createSelector([getPaths, getPosParam], (paths, pos) =>
  arrayLookup(paths)('')(pos),
)

/**
 *
 */
export const getAllowedPaths = createSelector(
  [getPaths, getProgress],
  /**
   *
   * @param paths
   * @param progress
   * @returns
   * @example
   */
  (paths, progress) =>
    f.pipe(
      ['none', 'uploaded', 'matched', 'explored'] as Progress[],
      RA.mapWithIndex((i, p) => [p, RA.takeLeft(i + 2)(paths)] as const),
      RR.fromEntries,
      recordLookup,
    )([])(progress),
)

/**
 *
 */
export const getDisabled = createSelector(
  [getPath, getAllowedPaths],
  /**
   *
   * @param path
   * @param allowedPaths
   * @returns
   * @example
   */
  (path, allowedPaths) => P.not(RA.elem(S.Eq)(path))(allowedPaths),
)

export const getPosition = createSelector(
  [getLocationPathWords, getPaths],
  /**
   *
   * @param locationPathWords
   * @param paths
   * @returns
   * @example
   */
  (locationPathWords, paths) =>
    f.pipe(paths, RA.map(S.replace('/', '')), findIndex)(S.Eq)(
      arrayLookup(locationPathWords)('')(0),
    ),
)

/**
 *
 */
const getLocationHasVisit = createSelector(
  [getLocationPathWords],
  f.flow(
    arrayLookup,
    f.apply(''),
    f.apply(2),
    (x) => parseInt(x, 10),
    P.not(Number.isNaN),
  ),
)

/**
 *
 */
const getIsAtEda = createSelector([getPosition], equals(N.Eq)(3))

/**
 *
 */
export const getTitle = createSelector(
  [getLocationPathParam, getLocationHasVisit, getIsAtEda],
  /**
   *
   * @param locationPath
   * @param locationHasVisit
   * @param isAtEda
   * @returns
   * @example
   */
  (locationPath, locationHasVisit, isAtEda) =>
    getPathTitle(locationPath, locationHasVisit && isAtEda ? 2 : 1),
)

/**
 *
 */
export const getProgressValue = createSelector(
  [getPosition, getPaths],
  (position, paths) => position / (paths.length - 1) || 0.011,
)

/**
 *
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
