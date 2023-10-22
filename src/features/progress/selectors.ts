import { createSelector } from '@reduxjs/toolkit'
import { matchRoutes, resolvePath } from 'react-router-dom'
import { getProgress } from '@/app/selectors'
import { routes } from '@/app/Router'
import { getPathTitle } from '@/lib/string'
import type { RootState } from '@/app/store'
import * as Str from 'fp-ts/string'
import * as O from 'fp-ts/Option'
import { constant, pipe, flow, flip } from 'fp-ts/function'
import * as RA from 'fp-ts/ReadonlyArray'
import { stringLookup } from '@/lib/array'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as P from 'fp-ts/Predicate'
import type { Progress } from './reducers'

const getLocationPathParam = (_: RootState, _1: string, locationPath: string) =>
  locationPath

const getComponentPathParam = (_: RootState, componentPath: string) =>
  componentPath

const getPosParam = (_: RootState, _1: string, _2: string, pos: number) => pos

const getLocationPathWords = createSelector(
  [getLocationPathParam],
  (locationPath) =>
    pipe(locationPath, Str.split('/'), RA.filter(P.not(Str.isEmpty))),
)

export const getPaths = createSelector(
  [getComponentPathParam],
  (componentPath) =>
    pipe(
      matchRoutes(routes, componentPath) ?? [],
      RA.findFirst(({ route }) => !route.index),
      O.getOrElse(
        constant({ route: routes[0] } as NonNullable<
          ReturnType<typeof matchRoutes>
        >[number]),
      ),
      ({ route }) => route.children ?? [],
      RA.findFirst(({ index }) => !index),
      O.getOrElse(
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
    RR.fromEntries(
      pipe(
        ['none', 'uploaded', 'matched', 'explored'] as Progress[],
        RA.mapWithIndex((i, p) => [p, RA.takeLeft(i + 2)(paths)]),
      ),
    )[progress] ?? [],
)

export const getDisabled = createSelector(
  [getPath, getAllowedPaths],
  (path, allowedPaths) => pipe(allowedPaths, P.not(RA.elem(Str.Eq)(path))),
)

export const getPosition = createSelector(
  [getLocationPathWords, getPaths],
  (locationPathWords, paths) =>
    pipe(
      paths,
      RA.map(Str.replace('/', '')),
      RA.findIndex((x) => Str.Eq.equals(x, stringLookup(locationPathWords)(0))),
      pipe(-1, constant, O.getOrElse),
    ),
)

const getLocationHasVisit = createSelector(
  [getLocationPathWords],
  flow(flip(stringLookup)(2), (x) => parseInt(x, 10), P.not(Number.isNaN)),
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
      RA.every(
        flow(
          Str.replace('/', ''),
          pipe(stringLookup(locationPathWords)(0), Str.includes, P.not),
        ),
      ),
    ),
)
