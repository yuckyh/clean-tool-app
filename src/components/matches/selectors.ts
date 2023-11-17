/**
 * @file This file contains the selectors for the matches component.
 */

import type { AppState } from '@/app/store'

import { getRow } from '@/selectors/data/rows'
import { getMatchColumn } from '@/selectors/matches/columns'
import { getMatchResult, getScoreResult } from '@/selectors/matches/results'
import { getScore } from '@/selectors/matches/scores'
import { getMatchVisit, getVisitByMatchVisit } from '@/selectors/matches/visits'

/**
 * The base props for the matches selectors.
 */
interface BaseProps {
  /**
   * The position of the column.
   */
  pos: number
}

/**
 * Selector function to get the column.
 * @param props - The {@link BaseProps props} for the component.
 * @param props.pos - The position of the column.
 * @returns The column.
 * @example
 * ```tsx
 *  const column = useAppSelector(selectColumn(props))
 * ```
 */
export const selectMatchColumn =
  ({ pos }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getMatchColumn(state, pos)

/**
 * Selector function to get the match visit.
 * @param props - The {@link BaseProps props} for the component.
 * @param props.pos - The position of the column.
 * @returns The match visit.
 * @example
 * ```tsx
 *  const matchVisit = useAppSelector(selectMatchVisit(props))
 * ```
 */
export const selectMatchVisit =
  ({ pos }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getMatchVisit(state, pos)

/**
 * Selector function to get the match result.
 * @param props - The {@link BaseProps props} for the component.
 * @param props.pos - The position of the column.
 * @returns The match result.
 * @example
 * ```tsx
 *  const matchResult = useAppSelector(selectMatchResult(pos))
 * ```
 */
export const selectResult =
  ({ pos }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getMatchResult(state, pos)

/**
 * Selector function to get the score result.
 * @param props - The {@link BaseProps props} for the component.
 * @param props.pos - The position of the column.
 * @returns The score result.
 * @example
 * ```tsx
 *  const scoreResult = useAppSelector(selectScoreResult(pos))
 * ```
 */
export const selectScoreResult =
  ({ pos }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getScoreResult(state, pos)

/**
 * Selector function to get the visit by match visit.
 * @param props - The {@link BaseProps props} for the component.
 * @param props.pos - The position of the column.
 * @returns The visit by match visit.
 * @example
 * ```tsx
 *  const visit = useAppSelector(selectVisitByMatchVisit(props))
 * ```
 */
export const selectVisitByMatchVisit =
  ({ pos }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getVisitByMatchVisit(state, pos)

/**
 * Selector function to get the row.
 * @param props - The {@link BaseProps props} for the component.
 * @returns The row.
 * @example
 * ```tsx
 *  const row = useAppSelector(selectRow(props))
 * ```
 */
export const selectRow = (props: Readonly<BaseProps>) => (state: AppState) =>
  getRow(
    state,
    selectMatchColumn(props)(state),
    selectVisitByMatchVisit(props)(state),
  )

/**
 * Selector function to get the score.
 * @param props - The {@link BaseProps props} for the component.
 * @param props.pos - The position of the column.
 * @returns The score.
 * @example
 * ```tsx
 *  const score = useAppSelector(selectScore(props))
 * ```
 */
export const selectScore =
  ({ pos }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getScore(state, pos)
