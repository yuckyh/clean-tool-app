/**
 * @file The file contains the selectors for the column matching page.
 * @module pages/ColumnMatching/selectors
 */

/* eslint-disable
  import/prefer-default-export
*/

import type { AppState } from '@/app/store'

import { getOriginalColumn } from '@/selectors/data/columns'

/**
 * The base props for the column matching selectors.
 */
interface BaseProps {
  /**
   * The position of the column.
   */
  readonly pos: number
}

/**
 * Selector function to get the original column.
 * @param props - The {@link BaseProps props} for the component.
 * @param props.pos - The position of the column.
 * @returns The original column.
 * @example
 * ```tsx
 *  const originalColumn = useAppSelector(selectOriginalColumn(props))
 * ```
 */
export const selectOriginalColumn =
  ({ pos }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getOriginalColumn(state, pos)
