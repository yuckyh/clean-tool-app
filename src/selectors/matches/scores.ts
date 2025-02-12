/**
 * @file This file contains the scores selectors for the matches slice.
 */
import type { AppState } from '@/app/store'

import { getColParam } from '@/app/selectors'
import { arrayLookup } from '@/lib/array'
import { dualMap } from '@/lib/fp'
import { createSelector } from '@reduxjs/toolkit'
import * as f from 'fp-ts/function'
import * as S from 'fp-ts/string'

/**
 * Selector function to get the match scores.
 * @param state - The application state {@link AppState}
 * @param state.matches - The matches slice of the state
 * @returns The match scores.
 * @example
 *  const matchScores = useAppSelector(getMatchScores)
 */
export const getScores = ({ matches }: AppState) => matches.scores

/**
 *
 */
export const getScore = createSelector(
  [getScores, getColParam],
  (scores, col) => arrayLookup(scores)('1')(col),
)

/**
 *
 */
export const getScoreComparer = createSelector(
  [getScores],
  (scores) => (a: number, b: number) =>
    f.pipe(
      [a, b] as [number, number],
      dualMap(arrayLookup(scores)('0')),
      f.tupled(S.Ord.compare),
    ),
)
