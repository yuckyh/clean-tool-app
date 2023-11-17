/**
 * @file The file contains the selectors for the download page.
 * @module pages/Download/selectors
 */

import type { AppState } from '@/app/store'

import { arrayLookup } from '@/lib/array'
import { getCell } from '@/selectors/data/cells'
import { getIndexRow } from '@/selectors/data/rows'
import { getFormattedColumn } from '@/selectors/matches/format'

/**
 * The base props for the download selectors.
 */
interface BaseProps {
  /**
   * The column position of the cell.
   */
  readonly col: number
  /**
   * The row position of the cell.
   */
  readonly row: number
}

/**
 * Selector function to get the cell.
 * @param props - The {@link BaseProps props} for the component.
 * @param props.col - The column position of the cell.
 * @param props.row - The row position of the cell.
 * @returns The cell.
 * @example
 * ```tsx
 *  const cell = useAppSelector(selectCell(props))
 * ```
 */
export const selectCell =
  ({ col, row }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getCell(state, col, row)
/**
 * Selector function to get the formatted column.
 * @param props - The {@link BaseProps props} for the component.
 * @param props.col - The column position of the cell.
 * @returns The formatted column.
 * @example
 * ```tsx
 *  const formattedColumn = useAppSelector(selectFormattedColumn(props))
 * ```
 */
export const selectFormattedColumn =
  ({ col }: Readonly<BaseProps>) =>
  (state: AppState) =>
    getFormattedColumn(state, col)
/**
 * Selector function to get the index cell.
 * @param props - The {@link BaseProps props} for the component.
 * @param props.row - The row position of the cell.
 * @returns The index cell.
 * @example
 * ```tsx
 *  const indexCell = useAppSelector(selectIndexCell(props))
 * ```
 */
export const selectIndex =
  ({ row }: Readonly<BaseProps>) =>
  (state: AppState) =>
    arrayLookup(getIndexRow(state))('')(row)
