import type { AppState } from '@/app/store'

import { routes } from '@/app/Router'
import { getProgress } from '@/app/selectors'
import { arrLookup } from '@/lib/array'
import { getPathTitle } from '@/lib/fp/string'
import { createSelector } from '@reduxjs/toolkit'
import * as O from 'fp-ts/Option'
import * as P from 'fp-ts/Predicate'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as f from 'fp-ts/function'
import * as S from 'fp-ts/string'
import { matchRoutes, resolvePath } from 'react-router-dom'

import type { Progress } from './reducers'

const getLocationPathParam = (_: AppState, _1: string, locationPath: string) =>
  locationPath

const getComponentPathParam = (_: AppState, componentPath: string) =>
  componentPath

const getPosParam = (_: AppState, _1: string, _2: string, pos: number) => pos

export const getLocationPathWords = createSelector(
  [getLocationPathParam],
  (locationPath) =>
    f.pipe(locationPath, S.split('/'), RA.filter(P.not(S.isEmpty))),
)

export const getPaths = createSelector(
  [getComponentPathParam],
  (componentPath) =>
    f.pipe(
      matchRoutes(routes, componentPath) ?? [],
      RA.findFirst(({ route }) => !route.index),
      O.getOrElse(
        f.constant({ route: routes[0] } as NonNullable<
          ReturnType<typeof matchRoutes>
        >[number]),
      ),
      ({ route }) => route.children ?? [],
      RA.findFirst(({ index }) => !index),
      O.getOrElse(
        f.constant(
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
  arrLookup(paths)('')(pos),
)

export const getAllowedPaths = createSelector(
  [getPaths, getProgress],
  (paths, progress) =>
    RR.fromEntries(
      f.pipe(
        ['none', 'uploaded', 'matched', 'explored'] as Progress[],
        RA.mapWithIndex((i, p) => [p, RA.takeLeft(i + 2)(paths)]),
      ),
    )[progress] ?? [],
)

export const getDisabled = createSelector(
  [getPath, getAllowedPaths],
  (path, allowedPaths) => f.pipe(allowedPaths, P.not(RA.elem(S.Eq)(path))),
)

export const getPosition = createSelector(
  [getLocationPathWords, getPaths],
  (locationPathWords, paths) =>
    f.pipe(
      paths,
      RA.map(S.replace('/', '')),
      RA.findIndex((x) => S.Eq.equals(x, arrLookup(locationPathWords)('')(0))),
      f.pipe(-1, f.constant, O.getOrElse),
    ),
)

const getLocationHasVisit = createSelector(
  [getLocationPathWords],
  f.flow(
    f.flip(arrLookup)(''),
    f.apply(2),
    (x) => parseInt(x, 10),
    P.not(Number.isNaN),
  ),
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
    f.pipe(
      allowedPaths,
      RA.every(
        f.flow(
          S.replace('/', ''),
          f.pipe(arrLookup(locationPathWords)('')(0), S.includes, P.not),
        ),
      ),
    ),
)
