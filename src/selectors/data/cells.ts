/**
 * @file This file contains cell selectors for the data slice.
 * @module selectors/data/cells
 */

import type { AppState } from '@/app/store'

import { getRowParam } from '@/app/selectors'
import { arrayLookup, recordLookup } from '@/lib/array'
import * as CellItem from '@/lib/fp/CellItem'
import { createSelector } from '@reduxjs/toolkit'
import * as f from 'fp-ts/function'

import { getData } from '.'
import { getOriginalColumn } from './columns'

/**
 * Selector function to get the flagged cells from the data slice of the state.
 * @param state - The application state {@link AppState}
 * @param state.data - The data slice of the state.
 * @returns The flagged cells.
 * @example
 *  const flaggedCells = useAppSelector(getFlaggedCells)
 */
export const getFlaggedCells = ({ data }: AppState) => data.flaggedCells

/**
 * Selector function to get the cell from the data array.
 * @param state - The application state {@link AppState}
 * @param col - The column position parameter
 * @param row - The row position parameter
 * @returns The cell from the data array
 * @example
 *  const cell = useAppSelector(selectCell(col, row))
 */
export const getCell = createSelector(
  [getData, getOriginalColumn, getRowParam],
  (data, originalColumn, row) =>
    f.pipe(
      arrayLookup(data)(CellItem.of({}))(row),
      CellItem.unwrap,
      recordLookup,
    )('')(originalColumn),
)
