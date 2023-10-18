import { createSelector } from '@reduxjs/toolkit'
import { matchRoutes, resolvePath } from 'react-router-dom'
import { getProgress } from '@/app/selectors'
import { routes } from '@/app/Router'
import { getPathTitle } from '@/lib/string'
import type { RootState } from '@/app/store'
import { includes, isEmpty, replace, split, Eq } from 'fp-ts/string'
import { getOrElse } from 'fp-ts/Option'
import { constant, pipe, flow, flip } from 'fp-ts/function'
import { filter } from 'fp-ts/ReadonlyNonEmptyArray'
import * as RA from 'fp-ts/ReadonlyArray'
import { stringLookup } from '@/lib/array'
import { fromEntries } from 'fp-ts/ReadonlyRecord'
import { not } from 'fp-ts/Predicate'
import type { Progress } from './reducers'

const getLocationPathParam = (_: RootState, _1: string, locationPath: string) =>
  locationPath

const getComponentPathParam = (_: RootState, componentPath: string) =>
  componentPath

const getPosParam = (_: RootState, _1: string, _2: string, pos: number) => pos

const getLocationPathWords = createSelector(
  [getLocationPathParam],
  (locationPath) =>
    pipe(
      locationPath,
      split('/'),
      filter(isEmpty),
      getOrElse(pipe(locationPath, split('/'), constant)),
    ),
)

export const getPaths = createSelector(
  [getComponentPathParam],
  (componentPath) =>
    pipe(
      matchRoutes(routes, componentPath) ?? [],
      RA.findFirst(({ route }) => !route.index),
      getOrElse(
        constant({ route: routes[0] } as NonNullable<
          ReturnType<typeof matchRoutes>
        >[number]),
      ),
      ({ route }) => route.children ?? [],
      RA.findFirst(({ index }) => !index),
      getOrElse(
        constant(
          routes[0] as NonNullable<
            NonNullable<
              ReturnType<typeof matchRoutes>
            >[number]['route']['children']
          >[number],
        ),
      ),
      ({ children = [] }) => children,
      RA.map(({ path = '' }) => resolvePath(path).pathname.toLowerCase()),
    ),
)

export const getPath = createSelector([getPaths, getPosParam], (paths, pos) =>
  stringLookup(paths)(pos),
)

// export const getPathLabel = createSelector([getPath])

export const getAllowedPaths = createSelector(
  [getPaths, getProgress],
  (paths, progress) =>
    fromEntries(
      pipe(
        ['none', 'uploaded', 'matched', 'explored'] as Progress[],
        RA.mapWithIndex((i, p) => [p, RA.takeLeft(i + 2)(paths)]),
      ),
    )[progress] ?? [],
)

export const getDisabled = createSelector(
  [getPath, getAllowedPaths],
  (path, allowedPaths) => pipe(allowedPaths, not(RA.elem(Eq)(path))),
)

export const getPosition = createSelector(
  [getLocationPathWords, getPaths],
  (locationPathWords, paths) =>
    pipe(
      paths,
      RA.map(replace('/', '')),
      RA.findIndex((x) => Eq.equals(x, locationPathWords[0])),
      getOrElse(constant(-1)),
    ),
)

const getLocationHasVisit = createSelector(
  [getLocationPathWords],
  flow(flip(stringLookup)(2), (x) => parseInt(x, 10), not(Number.isNaN)),
)

const getIsAtEda = createSelector([getPosition], (position) => position === 3)

export const getTitle = createSelector(
  [getLocationPathParam, getLocationHasVisit, getIsAtEda],
  (locationPath, locationHasVisit, isAtEda) =>
    getPathTitle(locationPath, locationHasVisit && isAtEda ? 2 : 1),
)

export const getProgressValue = createSelector(
  [getPosition, getPaths],
  (position, paths) => position / (paths.length - 1) || 0.011,
)

export const getShouldNavigateToAllowed = createSelector(
  [getLocationPathWords, getAllowedPaths],
  (locationPathWords, allowedPaths) =>
    pipe(
      allowedPaths,
      RA.some(
        flow(
          replace('/', ''),
          not(includes(stringLookup(locationPathWords)(0))),
        ),
      ),
    ),
)
