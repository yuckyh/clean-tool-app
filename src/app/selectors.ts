import type * as Flag from '@/lib/fp/Flag'

import { getDataLength } from '@/selectors/data/data'
import * as f from 'fp-ts/function'

import type { AppState } from './store'

/**
 * Utility function to get the column position parameter
 * @param _state - The application state {@link AppState}
 * @param col - The column position parameter
 * @returns The column position parameter
 * @example
 *  const getOriginalColumn = createSelector(
 *    [getOriginalColumns, getColParam],
 *    (originalColumns, pos) => arrayLookup(originalColumns)('')(pos),,
 *  )
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
 *  const getCell = createSelector(
 *    [getData, getOriginalColumn, getRowParam],
 *    (data, originalColumn, row) =>
 *      f.pipe(
 *        arrayLookup(data)(CellItem.of({}))(row),
 *        CellItem.unwrap,
 *        recordLookup,
 *      )('')(originalColumn),
 *    )
 */
export const getRowParam = (_state: AppState, _col: number, row: number) => row

/**
 * Utility function to get the column parameter
 * @param _state - The application state {@link AppState}
 * @param column - The column parameter
 * @returns The column parameter
 * @example
 *  const getSearchedPos = createSelector(
 *    [getIndices, getVisits, getColumnParam, getVisitParam],
 *    searchPos,
 *  )
 */
export const getColumnParam = (_state: AppState, column: string) => column

/**
 * Utility function to get the visit parameter
 * @param _state - The application state {@link AppState}
 * @param _column - The column parameter
 * @param visit - The visit parameter
 * @returns The visit parameter
 * @example
 *  const getSearchedPos = createSelector(
 *    [getIndices, getVisits, getColumnParam, getVisitParam],
 *    searchPos,
 *  )
 */
export const getVisitParam = (
  _state: AppState,
  _column: string,
  visit: string,
) => visit

/**
 *
 * @param _
 * @param _componentPath
 * @param locationPath
 * @returns
 * @example
 */
export const getLocationPathParam = (
  _: AppState,
  _componentPath: string,
  locationPath: string,
) => locationPath

/**
 *
 * @param _
 * @param componentPath
 * @returns
 * @example
 */
export const getComponentPathParam = (_: AppState, componentPath: string) =>
  componentPath

/**
 *
 * @param _
 * @param _componentPath
 * @param _locationPath
 * @param pos
 * @returns
 * @example
 */
export const getPosParam = (
  _: AppState,
  _componentPath: string,
  _locationPath: string,
  pos: number,
) => pos

/**
 * Utility function to get the title parameter
 * @param _state - The application state {@link AppState}
 * @param title - The title parameter
 * @returns The title parameter
 * @example
 *  const getFlaggedRows = createSelector(
 *    [getFlaggedCells, getTitleParam, getReasonParam],
 *    (flaggedCells, title, reason) =>
 *      f.pipe(
 *        Eq.tuple(
 *          stubEq<string>(),
 *          S.Eq,
 *          refinedEq<Flag.FlagReason, string>(S.Eq),
 *        ),
 *      Flag.getEq,
 *      equals,
 *      f.apply(Flag.of('', title, reason)),
 *      RA.filter<Flag.Flag>,
 *      f.apply(flaggedCells),
 *      RS.fromReadonlyArray(Flag.Eq),
 *      RS.map(S.Eq)(({ value: [index] }) => index),
 *    ),
 *  )
 */
export const getTitleParam = (_state: AppState, title: string) => title

/**
 * Utility function to get the reason parameter
 * @param _state - The application state {@link AppState}
 * @param _title - The title parameter
 * @param reason - The reason parameter
 * @returns The reason parameters
 * @example
 */
export const getReasonParam = (
  _state: AppState,
  _title: string,
  reason: Flag.FlagReason,
) => reason

/**
 *
 * @param state
 * @param state.sheet
 * @param state.data
 * @returns
 * @example
 */
export const getFileName = ({ data }: AppState) => data.fileName

/**
 *
 * @param state
 * @param state.sheet
 * @param state.data
 * @returns
 * @example
 */
export const getSheetName = ({ data }: AppState) => data.sheetName

/**
 *
 * @param state
 * @param state.sheet
 * @param state.data
 * @returns
 * @example
 */
export const getSheetNames = ({ data }: AppState) => data.sheetNames

/**
 *
 * @param state
 * @param state.data
 * @returns
 * @example
 */
export const getFlaggedCells = ({ data }: AppState) => data.flaggedCells

/**
 *
 */
export const getHasSheet = f.flow(getDataLength, Boolean)

/**
 *
 * @param state
 * @param state.data
 * @returns
 * @example
 */
export const getHasMultipleSheets = ({ data }: AppState) => !data.bookType

/**
 *
 * @param state
 * @param state.matches
 * @returns
 * @example
 */
export const getScoresList = ({ matches }: AppState) => matches.resultsScores

/**
 *
 * @param state
 * @param state.matches
 * @returns
 * @example
 */
export const getDataTypes = ({ matches }: AppState) => matches.dataTypes
