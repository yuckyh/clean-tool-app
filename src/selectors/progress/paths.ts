/**
 * @file The file contains the selectors for the paths in the progress slice.
 * @module selectors/progress/paths
 */

import type { RouteObject } from 'react-router-dom'

import { routes } from '@/app/Router'
import {
  getComponentPathParam,
  getLocationPathParam,
  getPosParam,
} from '@/app/selectors'
import { arrayLookup, findIndex } from '@/lib/array'
import { equals } from '@/lib/fp'
import { getPathTitle } from '@/lib/fp/string'
import { createSelector } from '@reduxjs/toolkit'
import * as O from 'fp-ts/Option'
import * as P from 'fp-ts/Predicate'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'
import * as N from 'fp-ts/number'
import * as S from 'fp-ts/string'
import { matchRoutes, resolvePath } from 'react-router-dom'

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

export const getPath = createSelector([getPaths, getPosParam], (paths, pos) =>
  arrayLookup(paths)('')(pos),
)

/**
 * The selector to get the position for the current progress nav item.
 * @param componentPath - The progress nav's component path in the router.
 * @param locationPath - The current location path.
 * @returns The selector.
 * @example
 *  const { pathname: componentPath } = useResolvedPath('')
 *  const { pathname: locationPath } = useLocation()
 *  const position = useAppSelector((state) => getPosition(state, componentPath, locationPath))
 */
export const getPosition = createSelector(
  [getLocationPathWords, getPaths],
  (locationPathWords, paths) =>
    f.pipe(paths, RA.map(S.replace('/', '')), findIndex)(S.Eq)(
      arrayLookup(locationPathWords)('')(0),
    ),
)

/**
 * The selector to get whether the current location has a visit in the path.
 * @param locationPath - The current location path.
 * @returns The selector.
 * @example
 * ```ts
 *    const { pathname: locationPath } = useLocation()
 *    const locationHasVisit = useAppSelector((state) => getLocationHasVisit(state, locationPath))
 * ```
 */
export const getLocationHasVisit = createSelector(
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
 * The selector to get whether the current location is at the EDA page.
 * @param locationPath - The current location path.
 * @returns The selector.
 * @example
 * ```ts
 *    const { pathname: locationPath } = useLocation()
 *    const isAtEda = useAppSelector((state) => getIsAtEda(state, locationPath))
 * ```
 */
export const getIsAtEda = createSelector([getPosition], equals(N.Eq)(3))

/**
 * The selector to get the title for the current progress nav item.
 * @param locationPath - The current location path.
 * @returns The selector.
 * @example
 * ```ts
 *    const { pathname: locationPath } = useLocation()
 *    const title = useAppSelector((state) => getTitle(state, locationPath))
 * ```
 */
export const getTitle = createSelector(
  [getLocationPathParam, getLocationHasVisit, getIsAtEda],
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
