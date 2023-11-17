/**
 * @file This file contains the global app selectors.
 * @module app/selectors
 */

import type * as Flag from '@/lib/fp/Flag'
import type { RouteObject } from 'react-router-dom'

import globalStyles from '@/app/global.css?inline'
import { dumpError } from '@/lib/fp/logger'
import { makeStaticStyles } from '@fluentui/react-components'
import * as O from 'fp-ts/Option'
import * as T from 'fp-ts/Task'
import * as TO from 'fp-ts/TaskOption'
import * as f from 'fp-ts/function'
import { useEffect } from 'react'

import type { AppState } from './store'

/**
 * Utility function to get the column position parameter
 * @param _state - The application state {@link AppState}
 * @param col - The column position parameter
 * @returns The column position parameter
 * @example
 *  const getOriginalColumn = createSelector(
 *    [getOriginalColumns, getColParam],
 *      ...
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
 *      ...
 *  )
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
 * Utility function to get the location path parameter
 * @param _state - The application state {@link AppState}
 * @param _componentPath - The component path parameter
 * @param locationPath - The current location path.
 * @returns The location path parameter
 * @example
 *  const getTitle = createSelector(
 *    [getLocationPathParam, getLocationHasVisit, getIsAtEda],
 *    (locationPath, locationHasVisit, isAtEda) =>
 *      ...
 *  )
 */
export const getLocationPathParam = (
  _state: AppState,
  _componentPath: string,
  locationPath: string,
) => locationPath

/**
 * Utility function to get the component path parameter
 * @param _state - The application state {@link AppState}
 * @param componentPath - The progress nav's component path in the router.
 * @returns The component path parameter
 * @example
 *  const getPaths = createSelector(
 *    [getComponentPathParam],
 *    (componentPath) =>
 *       ...
 *  )
 */
export const getComponentPathParam = (
  _state: AppState,
  componentPath: string,
) => componentPath

/**
 * Utility function to get the position parameter when used with the location path parameter.
 * @param _state - The application state {@link AppState}
 * @param _componentPath - The component path parameter
 * @param _locationPath - The location path parameter
 * @param pos - The position parameter
 * @returns The position parameter
 * @example
 *  const getPath = createSelector([getPaths, getPosParam], (paths, pos) =>
 *    arrayLookup(paths)('')(pos),
 *  )
 */
export const getPosParam = (
  _state: AppState,
  _componentPath: string,
  _locationPath: string,
  pos: number,
) => pos

export const getRoutesParam = (
  _state: AppState,
  _componentPath: string,
  _locationPath: string,
  _pos: number,
  routes: readonly RouteObject[],
) => routes

/**
 * Utility function to get the title parameter
 * @param _state - The application state {@link AppState}
 * @param title - The title parameter
 * @returns The title parameter
 * @example
 *  const getFlaggedRows = createSelector(
 *    [getFlaggedCells, getTitleParam, getReasonParam],
 *      ...
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
 *  const getFlaggedRows = createSelector(
 *    [getFlaggedCells, getTitleParam, getReasonParam],
 *    (flaggedCells, title, reason) =>
 *      ...
 *  )
 */
export const getReasonParam = (
  _state: AppState,
  _title: string,
  reason: Flag.FlagReason,
) => reason

/**
 * 
 * @returns
 * @example
 */
export const useStorage = () => {
  useEffect(() => {
    f.pipe(
      navigator.storage.persisted.bind(navigator.storage),
      T.map(O.fromPredicate(f.identity)),
      TO.flatMapTask(() => navigator.storage.persist.bind(navigator.storage)),
      TO.getOrElse(() => T.of(false)),
    )().catch(dumpError)
  }, [])
}

export const useGlobalStyles = makeStaticStyles(globalStyles)
