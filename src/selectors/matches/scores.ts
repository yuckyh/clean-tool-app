import type { AppState } from '@/app/store'

import { getColParam } from '@/app/selectors'
import { arrayLookup } from '@/lib/array'
import { dualMap } from '@/lib/fp'
import fuse from '@/lib/fuse'
import { createSelector } from '@reduxjs/toolkit'
import * as f from 'fp-ts/function'
import * as N from 'fp-ts/number'

const search = fuse.search.bind(fuse)

/**
 *
 * @param state
 * @param state.matches
 * @returns
 * @example
 */
export const getScores = ({ matches }: AppState) => matches.scores

/**
 *
 */
export const getScore = createSelector(
  [getScores, getColParam],
  (scores, col) => arrayLookup(scores)(1)(col),
)

/**
 *
 */
export const getScoreComparer = createSelector(
  [getScores],
  (scores) => (a: number, b: number) =>
    f.pipe(
      [a, b] as [number, number],
      dualMap(arrayLookup(scores)(0)),
      f.tupled(N.Ord.compare),
    ),
)
