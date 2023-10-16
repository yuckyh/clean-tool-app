import { createSelector } from '@reduxjs/toolkit'
import { matchRoutes, resolvePath } from 'react-router-dom'
import {
  defaultTo,
  fromPairs,
  parseInt,
  includes,
  indexOf,
  replace,
  toLower,
  negate,
  isNaN,
  split,
  range,
  slice,
  flow,
  find,
  some,
  map,
  nth,
  zip,
} from 'lodash/fp'
import { getProgress } from '@/app/selectors'
import { routes } from '@/app/Router'
import type { Progress } from './reducers'
import { getPathTitle } from '@/lib/string'
import type { RootState } from '@/app/store'

const getLocationPathParam = (_: RootState, _1: string, locationPath: string) =>
  locationPath

const getComponentPathParam = (_: RootState, componentPath: string) =>
  componentPath

const getPosParam = (_: RootState, _1: string, _2: string, pos: number) => pos

const getLocationPathWords = createSelector(
  [getLocationPathParam],
  (locationPath) => split('/')(locationPath).splice(1),
)

export const getPaths = createSelector(
  [getComponentPathParam],
  (componentPath) =>
    flow(
      find<
        ArrayElement<
          NonNullable<
            ReturnType<typeof matchRoutes<ArrayElement<typeof routes>>>
          >
        >
      >(({ route }) => !route.index),
      (match) => match?.route.children ?? [],
      find(({ index }) => !index),
      (route) => route?.children ?? {},
      map(({ path = '' }) => toLower(resolvePath(path).pathname)),
    )(matchRoutes(routes, componentPath) ?? []),
)

export const getPath = createSelector([getPaths, getPosParam], (paths, pos) =>
  flow<[string[]], undefined | string, string>(nth(pos), defaultTo(''))(paths),
)

// export const getPathLabel = createSelector([getPath])

export const getAllowedPaths = createSelector(
  [getPaths, getProgress],
  (paths, progress) =>
    fromPairs<string[]>(
      zip(['none', 'uploaded', 'matched', 'explored'] as Progress[])(
        map<number, string[]>((i) => slice(0)(i + 2)(paths))(range(0)(4)),
      ) as [Progress, string[]][],
    )[progress] ?? [],
)

export const getDisabled = createSelector(
  [getPath, getAllowedPaths],
  (path, allowedPaths) => negate(includes(path))(allowedPaths),
)

export const getPosition = createSelector(
  [getLocationPathWords, getPaths],
  (locationPathWords, paths) =>
    flow(map(replace('/')('')), indexOf(locationPathWords[0] ?? ''))(paths),
)

const getLocationHasVisit = createSelector(
  [getLocationPathWords],
  flow(nth(2), defaultTo(''), parseInt(10), negate(isNaN)),
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
    some<string>(
      flow(
        replace('/', ''),
        negate(includes(flow(nth(0), defaultTo(''))(locationPathWords))),
      ),
    )(allowedPaths),
)
