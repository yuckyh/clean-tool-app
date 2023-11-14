import type * as Flag from '@/lib/fp/Flag'

import * as f from 'fp-ts/function'

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

/**
 *
 * @param _state
 * @param _column
 * @param visit
 * @returns
 * @example
 */
export const getVisitParam = (
  _state: AppState,
  _column: string,
  visit: string,
) => visit

/**
 *
 * @param _state
 * @param title
 * @returns
 * @example
 */
export const getTitleParam = (_state: AppState, title: string) => title

/**
 *
 * @param _state
 * @param _1
 * @param reason
 * @returns
 * @example
 */
export const getReasonParam = (
  _state: AppState,
  _1: string,
  reason: Flag.FlagReason,
) => reason

/**
 *
 * @param state
 * @param state.progress
 * @returns
 * @example
 */
export const getProgress = ({ progress }: AppState) => progress.progress

/**
 *
 * @param state
 * @param state.sheet
 * @returns
 * @example
 */
export const getFileName = ({ sheet }: AppState) => sheet.fileName

/**
 *
 * @param state
 * @param state.sheet
 * @returns
 * @example
 */
export const getSheetName = ({ sheet }: AppState) => sheet.sheetName

/**
 *
 * @param state
 * @param state.sheet
 * @returns
 * @example
 */
export const getSheetNames = ({ sheet }: AppState) => sheet.sheetNames

/**
 * Selector function to get the visits.
 * @param state - The application state {@link AppState}
 * @param state.sheet
 * @returns The visits that has been specified by the user
 * @example
 */
export const getVisits = ({ sheet }: AppState) => sheet.visits

/**
 *
 * @param state
 * @param state.sheet
 * @returns
 * @example
 */
export const getOriginalColumns = ({ sheet }: AppState) => sheet.originalColumns

/**
 *
 * @param state
 * @param state.sheet
 * @returns
 * @example
 */
export const getData = ({ sheet }: AppState) => sheet.data

/**
 *
 * @param state
 * @param state.sheet
 * @returns
 * @example
 */
export const getFlaggedCells = ({ sheet }: AppState) => sheet.flaggedCells

/**
 *
 * @param state
 * @param state.sheet
 * @returns
 * @example
 */
export const getDataLength = ({ sheet }: AppState) => sheet.data.length

/**
 *
 */
export const getHasSheet = f.flow(getDataLength, Boolean)

/**
 *
 * @param state
 * @returns
 * @example
 */
export const getHasMultipleSheets = (state: AppState) => !state.sheet.bookType

/**
 *
 * @param state
 * @param state.columns
 * @returns
 * @example
 */
export const getMatchColumns = ({ columns }: AppState) => columns.matchColumns

/**
 *
 * @param state
 * @param state.columns
 * @returns
 * @example
 */
export const getMatchVisits = ({ columns }: AppState) => columns.matchVisits

/**
 *
 * @param state
 * @param state.columns
 * @returns
 * @example
 */
export const getScoresList = ({ columns }: AppState) => columns.scoresList

/**
 *
 * @param state
 * @param state.columns
 * @returns
 * @example
 */
export const getMatchesList = ({ columns }: AppState) => columns.matchesList

/**
 *
 * @param state
 * @param state.columns
 * @returns
 * @example
 */
export const getDataTypes = ({ columns }: AppState) => columns.dataTypes
