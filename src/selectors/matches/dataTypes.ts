/**
 * @file This file contains the data types selectors for the matches slice.
 * @module selectors/matches/dataTypes
 */

import type { AppState } from '@/app/store'

import { getColParam } from '@/app/selectors'
import { arrayLookup } from '@/lib/array'
import { createSelector } from '@reduxjs/toolkit'

import { getSearchedPos } from './pos'

/**
 * Selector function to get the data types from the matches slice of the state.
 * @param state - The application state {@link AppState}
 * @param state.matches - The matches slice of the state.
 * @returns The data types from the matches slice of the state.
 * @example
 *  const dataTypes = useAppSelector(getDataTypes)
 */
export const getDataTypes = ({ matches }: AppState) => matches.dataTypes

/**
 * Selector function to get the data type from the data types array.
 * @param state - The application state {@link AppState}
 * @param pos - The column position parameter
 * @returns The data type from the data types array
 * @example
 *  const dataType = useAppSelector(getDataType)
 */
export const getDataType = createSelector(
  [getDataTypes, getColParam],
  (dataTypes, pos) => arrayLookup(dataTypes)('none')(pos),
)

/**
 * Selector function to get the searched data type from the data types array.
 * @param state - The application state {@link AppState}
 * @param column - The column parameter to search for
 * @param visit - The visit parameter to search for
 * @returns The searched data type from the data types array
 * @example
 *  const searchedDataType = useAppSelector(getSearchedDataType)
 */
export const getSearchedDataType = createSelector(
  [getDataTypes, getSearchedPos],
  (dataTypes, pos) => arrayLookup(dataTypes)('none')(pos),
)
