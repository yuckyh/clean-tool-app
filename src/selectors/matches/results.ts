import type { AppState } from '@/app/store'

import { getColParam } from '@/app/selectors'
import { arrayLookup } from '@/lib/array'
import { createSelector } from '@reduxjs/toolkit'

/**
 *
 * @param state
 * @param state.matches
 * @returns
 * @example
 */
export const getMatchResults = ({ matches }: AppState) => matches.results

/**
 *
 */
export const getMatchResult = createSelector(
  [getMatchResults, getColParam],
  (matchResults, pos) =>
    arrayLookup(matchResults)([] as readonly string[])(pos),
)

/**
 *
 * @param state
 * @param state.matches
 * @returns
 * @example
 */
export const getScoreResults = ({ matches }: AppState) => matches.resultsScores

/**
 *
 */
export const getScoreResult = createSelector(
  [getScoreResults, getColParam],
  (matchResults, pos) =>
    arrayLookup(matchResults)([] as readonly number[])(pos),
)
