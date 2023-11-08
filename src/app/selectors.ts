import type * as Flag from '@/lib/fp/Flag'

import * as Eq from 'fp-ts/Eq'
import * as S from 'fp-ts/string'

import type { AppState } from './store'

/**
 * Utility function to get the column position parameter
 * @param _state - The application state {@link AppState}
 * @param col - The column position parameter
 * @returns The column position parameter
 * @example
 * ```ts
 * const getOriginalColumn = createSelector(
 *  [getOriginalColumns, getColParam],
 *  (originalColumns, col) => originalColumns[col],
 * )
 * ```
 */
export const getColParam = (_state: AppState, col: number) => col

/**
 * Utility function to get the column position parameter
 *
 * This function is to be used with the column position parameter to select a cell from the data array
 * @param _state - The application state {@link AppState}
 * @param _col - The column position parameter
 * @param row - The row position parameter
 * @returns The row position parameter
 * @example
 * ```ts
 * const originalColumn = createSelector(
 *  [getOriginalColumn, getRowParam],
 *  (originalColumn, row) => originalColumn[row],
 * )
 * ```
 */
export const getRowParam = (_state: AppState, _col: number, row: number) => row

/**
 * Utility function to get the column parameter
 * @param _state - The application state {@link AppState}
 * @param column - The column parameter
 * @returns The column parameter
 * @example
 * ```ts
 * const originalColumn = createSelector(
 *  [getOriginalColumn, getColumnParam],
 *  (originalColumn, column) => data.map((row) => row[column]),
 * )
 * ```
 */
export const getColumnParam = (_state: AppState, column: string) => column

export const getVisitParam = (
  _state: AppState,
  _column: string,
  visit: string,
) => visit

export const getTitleParam = (_state: AppState, title: string) => title

export const getReasonParam = (
  _state: AppState,
  _1: string,
  reason: Flag.FlagReason,
) => reason

// Slice Selectors
export const getProgress = ({ progress }: AppState) => progress.progress

export const getSheetName = ({ sheet }: AppState) => sheet.sheetName

/**
 * Selector function to get the visits.
 * @param state - The application state {@link AppState}
 * @param state.sheet
 * @returns The visits that has been specified by the user
 * @example
 */
export const getVisits = ({ sheet }: AppState) => sheet.visits

export const getOriginalColumns = ({ sheet }: AppState) => sheet.originalColumns

export const getData = ({ sheet }: AppState) => sheet.data

export const getFlaggedCells = ({ sheet }: AppState) => sheet.flaggedCells

export const getMatchColumns = ({ columns }: AppState) => columns.matchColumns

export const getMatchVisits = ({ columns }: AppState) => columns.matchVisits

export const getScoresList = ({ columns }: AppState) => columns.scoresList

export const getMatchesList = ({ columns }: AppState) => columns.matchesList

export const getDataTypes = ({ columns }: AppState) => columns.dataTypes

export const indexEq = Eq.tuple(S.Eq, S.Eq)
