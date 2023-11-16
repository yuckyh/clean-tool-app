import type { AppState } from '@/app/store'
import type * as Flag from '@/lib/fp/Flag'

import {
  getFlaggedRows,
  getIndexedRow,
  getIndexedRowIncorrects,
  getIndexedRowMissings,
} from '@/selectors/data/rows'
import { getSearchedDataType } from '@/selectors/matches/dataTypes'
import { getFormattedColumn } from '@/selectors/matches/format'
import { getSearchedPos } from '@/selectors/matches/pos'

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

/**
 *
 * @param props
 * @param props.column
 * @param props.visit
 * @returns
 * @example
 */
export const selectMissingSeries =
  ({ column, visit }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getIndexedRowMissings(state, column, visit)

/**
 *
 * @param props
 * @param props.column
 * @param props.visit
 * @returns
 * @example
 */
export const selectTitle =
  ({ column, visit }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getFormattedColumn(state, getSearchedPos(state, column, visit))

/**
 *
 * @param props
 * @param props.column
 * @param props.visit
 * @returns
 * @example
 */
export const selectSeries =
  ({ column, visit }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getIndexedRow(state, column, visit)

/**
 *
 * @param props
 * @param props.column
 * @param props.visit
 * @returns
 * @example
 */
export const selectDataType =
  ({ column, visit }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getSearchedDataType(state, column, visit)
