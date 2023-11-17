/**
 * @file This file contains the selectors for the EDA variable plot page.
 * @module pages/EDA/Variable/Plot/selectors
 */

import type { AppState } from '@/app/store'

import { getNotOutliers, getOutliers } from '@/selectors/data/stats'

/**
 * The props for the plot selectors.
 */
interface BaseProps {
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
 * Selector function to get the outliers.
 * @param props - The {@link BaseProps props} for the component.
 * @param props.column - The column name.
 * @param props.visit - The visit value.
 * @returns The outliers.
 * @example
 * ```tsx
 *  const outliers = useAppSelector(selectOutliers(props))
 * ```
 */
export const selectOutliers =
  ({ column, visit }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getOutliers(state, column, visit)

/**
 * Selector function to get the non-outliers.
 * @param props - The {@link BaseProps props} for the component.
 * @param props.column - The column name.
 * @param props.visit - The visit value.
 * @returns The non-outliers.
 * @example
 * ```tsx
 *  const nonOutliers = useAppSelector(selectNonOutliers(props))
 * ```
 */
export const selectNonOutliers =
  ({ column, visit }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getNotOutliers(state, column, visit)
