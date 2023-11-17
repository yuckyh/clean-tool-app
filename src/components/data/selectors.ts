/**
 * @file The file contains the selectors for the data components.
 * @module components/data/selectors
 */

import type { AppState } from '@/app/store'

import { getCell } from '@/selectors/data/cells'
import { getOriginalColumn } from '@/selectors/data/columns'
import { getVisit } from '@/selectors/data/visits'
import { getDataType } from '@/selectors/matches/dataTypes'
import { getFormattedColumn } from '@/selectors/matches/format'

/**
 * The column props for the data selectors.
 */
interface ColProps {
  /**
   * Whether the column is original.
   */
  isOriginal?: boolean
  /**
   * The position of the visit.
   */
  readonly pos: number
}

/**
 * The cell props for the data selectors.
 */
interface CellProps {
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
 * Selector function to get the visit.
 * @param props - The props for the component.
 * @param props.pos - The position of the visit.
 * @returns The visit.
 * @example
 * ```tsx
 *  const visit = useAppSelector(selectVisit(props))
 * ```
 */
export const selectVisit =
  ({ pos }: Readonly<ColProps>) =>
  (state: AppState) =>
    getVisit(state, pos)

/**
 * Selector function to get the cell.
 * @param props - The props for the component.
 * @param props.col - The column position of the cell.
 * @param props.row - The row position of the cell.
 * @returns The cell.
 * @example
 * ```tsx
 *  const cell = useAppSelector(selectCell(props))
 * ```
 */
export const selectCell =
  ({ col, row }: Readonly<CellProps>) =>
  (state: AppState) =>
    getCell(state, col, row)

/**
 * Selector function to get the column.
 * @param props - The props for the component.
 * @param props.isOriginal - Whether the column is original.
 * @param props.pos - The position of the column.
 * @returns The column.
 * @example
 * ```tsx
 * const column = useAppSelector(selectColumn(props))
 * ```
 */
export const selectColumn =
  ({ isOriginal, pos }: Readonly<ColProps>) =>
  (state: AppState) =>
    isOriginal ? getOriginalColumn(state, pos) : getFormattedColumn(state, pos)

/**
 * Selector function to get the data type of the column.
 * @param props - The props for the component.
 * @param props.pos - The position of the column.
 * @returns The data type of the column.
 * @example
 * ```tsx
 *  const dataType = useAppSelector(selectDataType(props))
 * ```
 */
export const selectDataType =
  ({ pos }: Readonly<ColProps>) =>
  (state: AppState) =>
    getDataType(state, pos)
