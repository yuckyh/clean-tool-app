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
 *
 * @param props
 * @param props.pos
 * @returns
 * @example
 */
export const selectMatchColumn =
  ({ pos }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getMatchColumn(state, pos)

/**
 *
 * @param props
 * @param props.pos
 * @returns
 * @example
 */
export const selectMatchVisit =
  ({ pos }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getMatchVisit(state, pos)

/**
 *
 * @param props
 * @param props.pos
 * @returns
 * @example
 */
export const selectResult =
  ({ pos }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getMatchResult(state, pos)

/**
 *
 * @param props
 * @param props.pos
 * @returns
 * @example
 */
export const selectScoreResult =
  ({ pos }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getScoreResult(state, pos)

/**
 *
 * @param props
 * @returns
 * @example
 */
export const selectRow = (props: Readonly<BaseProps>) => (state: AppState) =>
  getRow(
    state,
    selectMatchColumn(props)(state),
    selectVisitByMatchVisit(props)(state),
  )

/**
 *
 * @param props
 * @param props.pos
 * @returns
 * @example
 */
export const selectScore =
  ({ pos }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getScore(state, pos)

/**
 *
 * @param props
 * @param props.pos
 * @returns
 * @example
 */
export const selectVisitByMatchVisit =
  ({ pos }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getVisitByMatchVisit(state, pos)
