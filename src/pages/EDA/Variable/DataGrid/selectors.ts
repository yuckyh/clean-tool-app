/**
 * @file This file contains the selectors for the EDA data grids.
 * @module pages/EDA/Variable/DataGrid/selectors
 */

import type { AppState } from '@/app/store'
import type * as Flag from '@/lib/fp/Flag'

import {
  getFlaggedRows,
  getIndexedRow,
  getIndexedRowIncorrects,
  getIndexedRowMissings,
} from '@/selectors/data/rows'
import { getMean, getMedian, getOutliers, getSd } from '@/selectors/data/stats'
import { getSearchedDataType } from '@/selectors/matches/dataTypes'
import { getFormattedColumn } from '@/selectors/matches/format'
import { getSearchedPos } from '@/selectors/matches/pos'

/**
 * The base props for the data grid selectors.
 */
export interface BaseProps {
  /**
   * The column name.
   */
  column: string
  /**
   * The visit value.
   */
  visit: string
}

/**
 * Selector function to get the column.
 * @param props - The {@link BaseProps props} for the component.
 * @param props.column - The column name.
 * @param props.visit - The visit value.
 * @returns The column.
 * @example
 * ```tsx
 *  const column = useAppSelector(selectColumn(props))
 * ```
 */
export const selectFormattedColumn =
  ({ column, visit }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getFormattedColumn(state, getSearchedPos(state, column, visit))

/**
 * Selector function to get the flagged rows.
 * @param title - The variable title.
 * @param reason - The flag reason.
 * @returns The flagged rows.
 * @example
 * ```tsx
 *  const flaggedRows = useAppSelector(selectFlaggedRows(title, reason))
 * ```
 */
export const selectFlaggedRows =
  (title: string, reason: Flag.FlagReason) => (state: AppState) =>
    getFlaggedRows(state, title, reason)

/**
 * Selector function to get the incorrect series.
 * @param props - The {@link BaseProps props} for the component.
 * @param props.column - The column name.
 * @param props.visit - The visit value.
 * @returns The incorrect series.
 * @example
 * ```tsx
 *  const incorrectSeries = useAppSelector(selectIncorrectSeries(props))
 * ```
 */
export const selectIncorrectSeries =
  ({ column, visit }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getIndexedRowIncorrects(state, column, visit)

/**
 * Selector function to get the missing series.
 * @param props - The {@link BaseProps props} for the component.
 * @param props.column - The column name.
 * @param props.visit - The visit value.
 * @returns The missing series.
 * @example
 * ```tsx
 *  const missingSeries = useAppSelector(selectMissingSeries(props))
 * ```
 */
export const selectMissingSeries =
  ({ column, visit }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getIndexedRowMissings(state, column, visit)

/**
 * Selector function to get the suspected outliers series.
 * @param props - The {@link BaseProps props} for the component.
 * @param props.column - The column name.
 * @param props.visit - The visit value.
 * @returns The suspected outliers series.
 * @example
 * ```tsx
 *  const suspectedSeries = useAppSelector(selectSuspectedSeries(props))
 * ```
 */
export const selectSuspectedSeries =
  ({ column, visit }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getOutliers(state, column, visit)

/**
 * Selector function to get the variable title.
 * @param props - The {@link BaseProps props} for the component.
 * @param props.column - The column name.
 * @param props.visit - The visit value.
 * @returns The variable title.
 * @example
 * ```tsx
 *  const title = useAppSelector(selectTitle(props))
 * ```
 */
export const selectTitle =
  ({ column, visit }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getFormattedColumn(state, getSearchedPos(state, column, visit))

/**
 * Selector function to get the series.
 * @param props - The {@link BaseProps props} for the component.
 * @param props.column - The column name.
 * @param props.visit - The visit value.
 * @returns The series.
 * @example
 * ```tsx
 *  const series = useAppSelector(selectSeries(props))
 * ```
 */
export const selectSeries =
  ({ column, visit }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getIndexedRow(state, column, visit)

/**
 * Selector function to get the data type.
 * @param props - The {@link BaseProps props} for the component.
 * @param props.column - The column name.
 * @param props.visit - The visit value.
 * @returns The data type.
 * @example
 * ```tsx
 *  const dataType = useAppSelector(selectDataType(props))
 * ```
 */
export const selectDataType =
  ({ column, visit }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getSearchedDataType(state, column, visit)

/**
 * Selector function to get the mean.
 * @param props - The {@link BaseProps props} for the component.
 * @param props.column - The column name.
 * @param props.visit - The visit value.
 * @returns The mean.
 * @example
 * ```tsx
 *  const mean = useAppSelector(selectMean(props))
 * ```
 */
export const selectMean =
  ({ column, visit }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getMean(state, column, visit)

/**
 * Selector function to get the median.
 * @param props - The {@link BaseProps props} for the component.
 * @param props.column - The column name.
 * @param props.visit - The visit value.
 * @returns The median.
 * @example
 * ```tsx
 *  const median = useAppSelector(selectMedian(props))
 * ```
 */
export const selectMedian =
  ({ column, visit }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getMedian(state, column, visit)

/**
 * Selector function to get the standard deviation.
 * @param props - The {@link BaseProps props} for the component.
 * @param props.column - The column name.
 * @param props.visit - The visit value.
 * @returns The standard deviation.
 * @example
 * ```tsx
 *  const sd = useAppSelector(selectSd(props))
 * ```
 */
export const selectSd =
  ({ column, visit }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getSd(state, column, visit)
