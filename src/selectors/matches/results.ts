/**
 * @file This file contains the results selectors for the matches slice.
 * @module selectors/matches/results
 */

import type { AppState } from '@/app/store'

import { getColParam } from '@/app/selectors'
import { arrayLookup } from '@/lib/array'
import { createSelector } from '@reduxjs/toolkit'

/**
 * Selector function to get the match results from the matches slice of the state.
 * @param state - The application state {@link AppState}
 * @param state.matches - The matches slice of the state.
 * @returns The match results.
 * @example
 *  const matchResults = useAppSelector(getMatchResults)
 */
export const getMatchResults = ({ matches }: AppState) => matches.results

/**
 * Selector function to get the score results from the matches slice of the state.
 * @param state - The application state {@link AppState}
 * @param state.matches - The matches slice of the state.
 * @returns The score results.
 * @example
 *  const scoreResults = useAppSelector(getScoreResults)
 */
export const getScoreResults = ({ matches }: AppState) => matches.resultsScores

/**
 * Selector function to get the match result from the match results array.
 * @param state - The application state {@link AppState}
 * @param pos - The column position parameter
 * @returns The match result from the match results array
 * @example
 *  const matchResult = useAppSelector(selectMatchResult(pos))
 */
export const getMatchResult = createSelector(
  [getMatchResults, getColParam],
  (matchResults, pos) =>
    arrayLookup(matchResults)([] as readonly string[])(pos),
)

/**
 * Selector function to get the score result from the score results array.
 * @param state - The application state {@link AppState}
 * @param pos - The column position parameter
 * @returns The score result from the score results array
 * @example
 * const scoreResult = useAppSelector(selectScoreResult(pos))
 */
export const getScoreResult = createSelector(
  [getScoreResults, getColParam],
  (matchResults, pos) =>
    arrayLookup(matchResults)([] as readonly number[])(pos),
)
