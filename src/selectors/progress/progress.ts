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
