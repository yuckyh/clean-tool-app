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

import { type Progress } from './reducers'

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
export const getIsDisabled = createSelector(
  [getPath, getAllowedPaths],
  (path, allowedPaths) => P.not(RA.elem(S.Eq)(path))(allowedPaths),
)

/**
 * The selector to get the position for the current progress nav item.
 * @param componentPath - The progress nav's component path in the router.
 * @param locationPath - The current location path.
 * @returns The selector.
 * @example
 * ```ts
 *    const { pathname: locationPath } = useLocation()
 *    const position = useAppSelector((state) => getPosition(state, locationPath))
 * ```
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
 * The selector to get whether the current location is at the EDA page.
 * @param locationPath - The current location path.
 * @returns The selector.
 * @example
 * ```ts
 *    const { pathname: locationPath } = useLocation()
 *    const isAtEda = useAppSelector((state) => getIsAtEda(state, locationPath))
 * ```
 */
const getIsAtEda = createSelector([getPosition], equals(N.Eq)(3))

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

/**
 * The selector to get the allowed paths for the current progress navigation.
 * @param componentPath - The progress nav's component path in the router.
 * @returns The selector function.
 * @example
 * ```ts
 *    const allowedPaths = useAppSelector(selectAllowedPaths(componentPath))
 * ```
 */
export const selectAllowedPaths =
  (componentPath: string) => (state: AppState) =>
    getAllowedPaths(state, componentPath)

/**
 * The selector to get whether the user should be navigated to the allowed path.
 * @param componentPath - The progress nav's component path in the router.
 * @param locationPath - The current location path.
 * @returns The selector function.
 * @example
 * ```ts
 *    const shouldNavigateToAllowed = useAppSelector(
 *      selectShouldNavigateToAllowed(componentPath, locationPath),
 *    )
 * ```
 */
export const selectShouldNavigateToAllowed =
  (componentPath: string, locationPath: string) => (state: AppState) =>
    getShouldNavigateToAllowed(state, componentPath, locationPath)

/**
 * The selector to get the paths for the current progress navigation.
 * @param componentPath - The progress nav's component path in the router.
 * @returns The selector function.
 * @example
 * ```tsx
 *    const paths = useAppSelector(selectPaths(componentPath))
 * ```
 */
export const selectPaths = (componentPath: string) => (state: AppState) =>
  getPaths(state, componentPath)

/**
 * The selector to get the position for the current progress navigation.
 * @param componentPath - The progress nav's component path in the router.
 * @param locationPath - The current location path.
 * @returns The selector function.
 * @example
 * ```tsx
 *    const position = useAppSelector(selectPosition(componentPath, locationPath))
 * ```
 */
export const selectPosition =
  (componentPath: string, locationPath: string) => (state: AppState) =>
    getPosition(state, componentPath, locationPath)

/**
 * The selector to get whether the current progress nav item is disabled.
 * @param componentPath - The progress nav's component path in the router.
 * @param locationPath - The current location path.
 * @param pos - The position of the current progress nav item.
 * @returns The selector function.
 * @example
 * ```tsx
 *    const isDisabled = useAppSelector(selectIsDisabled(componentPath, locationPath, pos))
 * ```
 */
export const selectIsDisabled =
  (componentPath: string, locationPath: string, pos: number) =>
  (state: AppState) =>
    getIsDisabled(state, componentPath, locationPath, pos)

/**
 * The selector to get the progress value for the current progress navigation.
 * @param componentPath - The progress nav's component path in the router.
 * @param locationPath - The current location path.
 * @returns The selector function.
 * @example
 * ```tsx
 *    const progressValue = useAppSelector(selectProgressValue(componentPath, locationPath))
 * ```
 */
export const selectProgressValue =
  (componentPath: string, locationPath: string) => (state: AppState) =>
    getProgressValue(state, componentPath, locationPath)
