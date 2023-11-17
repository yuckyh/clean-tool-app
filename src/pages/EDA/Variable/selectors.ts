/**
 * @file This file contains the selectors for the EDA variable page.
 * @module pages/EDA/Variable/selectors
 */
import type { AppState } from '@/app/store'

import { getIndexedNumericalRow, getIndexedRow } from '@/selectors/data/rows'
import { getFirstVisit } from '@/selectors/data/visits'
import { getSearchedDataType } from '@/selectors/matches/dataTypes'
import { getSearchedPos } from '@/selectors/matches/pos'

import type { BaseProps } from './DataGrid/selectors'

/**
 * Selector function to get the column position.
 * @param column - The column name.
 * @param visit - The visit value.
 * @returns The searched column position.
 * @example
 * ```tsx
 *  const pos = useAppSelector(selectSearchedPos(column, visit))
 * ```
 */
export const selectSearchedPos =
  (column: string, visit: string) => (state: AppState) =>
    getSearchedPos(state, column, visit)

/**
 * Selector function to get whether the variable is categorical.
 * @param column - The column name.
 * @param visit - The visit value.
 * @returns Whether the variable is categorical.
 * @example
 * ```tsx
 *  const isCategorical = useAppSelector(selectIsCategorical(column, visit))
 * ```
 */
export const selectIsCategorical =
  (column: string, visit: string) => (state: AppState) =>
    getSearchedDataType(state, column, visit) === 'categorical'

/**
 * Selector function to get the non-null visit.
 * @param visit - The visit value.
 * @returns The non-null visit.
 * @example
 * ```tsx
 *  const visit = useAppSelector(selectVisit(visit))
 * ```
 */
export const selectVisit = (visit?: string) => (state: AppState) =>
  visit ?? getFirstVisit(state)

/**
 * Selector function to get the categorical series.
 * @param props - The {@link BaseProps props} for the component.
 * @param props.column - The column name.
 * @param props.visit - The visit value.
 * @returns The categorical series.
 * @example
 * ```tsx
 *  const categoricalSeries = useAppSelector(selectCategoricalSeries(props))
 * ```
 */

export const selectCategoricalSeries =
  ({ column, visit }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getIndexedRow(state, column, visit)

/**
 * Selector function to get the numerical series.
 * @param props - The {@link BaseProps props} for the component.
 * @param props.column - The column name.
 * @param props.visit - The visit value.
 * @returns The numerical series.
 * @example
 * ```tsx
 *  const numericalSeries = useAppSelector(selectNumericalSeries(props))
 * ```
 */

export const selectNumericalSeries =
  ({ column, visit }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getIndexedNumericalRow(state, column, visit)
