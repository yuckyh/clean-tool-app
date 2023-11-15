import type { AppState } from '@/app/store'
import type * as Flag from '@/lib/fp/Flag'

import { getFlaggedRows, getIndexedRowIncorrects } from '@/selectors/data/rows'
import { getSearchedPos } from '@/selectors/matches'
import { getFormattedColumn } from '@/selectors/matches/format'

/**
 *
 */
export interface BaseProps {
  /**
   *
   */
  column: string
  /**
   *
   */
  visit: string
}

/**
 *
 * @param props
 * @param props.column
 * @param props.visit
 * @returns
 * @example
 */
export const selectFormattedColumn =
  ({ column, visit }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getFormattedColumn(state, getSearchedPos(state, column, visit))

/**
 *
 * @param title
 * @param reason
 * @returns
 * @example
 */
export const selectFlaggedRows =
  (title: string, reason: Flag.FlagReason) => (state: AppState) =>
    getFlaggedRows(state, title, reason)

/**
 *
 * @param props
 * @param props.column
 * @param props.visit
 * @returns
 * @example
 */
export const selectIncorrectSeries =
  ({ column, visit }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getIndexedRowIncorrects(state, column, visit)
