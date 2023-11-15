/**
 * @file This file contains selectors for the data in the sheet slice.
 * @module selectors/data/data
 */

import type { AppState } from '@/app/store'

import { getDataTypes } from '@/app/selectors'
import { arrayLookup, findIndex } from '@/lib/array'
import { isCorrectNumber } from '@/lib/fp'
import * as CellItem from '@/lib/fp/CellItem'
import { createSelector } from '@reduxjs/toolkit'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as f from 'fp-ts/function'
import * as S from 'fp-ts/string'

import { getFormattedColumns } from '../matches/format'
import {
  getEmptyColumns,
  getOriginalColumns,
  getPosAtEmptyList,
} from './columns'

/**
 * Selector function to get the data from the sheet slice of the state
 * @param state - The application state {@link AppState}
 * @param state.sheet - The sheet slice of the state
 * @param state.data
 * @returns The data from the sheet slice of the state
 * @example
 *  const getColumnsByData = createSelector(
 *    [getData],
 *    f.flow(
 *      RA.map(RR.keys),
 *      head,
 *      f.apply([] as readonly (keyof CellItem.CellItem)[]),
 *    ),
 *  )
 */
export const getData = ({ data }: AppState) => data.data

/**
 *
 * @param state
 * @param state.data
 * @returns
 * @example
 */
export const getDataLength = ({ data }: AppState) => data.data.length

/**
 * Selector function to get the formatted data.
 *
 * To get the formatted data, the original, formatted, and empty columns are used to create a new array of {@link CellItem.CellItem CellItem} objects.
 *
 * Using the data types, the values of the {@link CellItem.CellItem CellItem} objects are converted to the correct type.
 *
 * The empty columns are then used to insert empty values into the {@link CellItem.CellItem CellItem} objects.
 * @param state - The application state {@link AppState}
 * @returns The formatted data
 * @example
 *  const getRenamedSheet = createSelector([getFormattedData], (formattedData) =>
 *    utils.json_to_sheet(formattedData as CellItem.CellItem[]),
 *  )
 */
export const getFormattedData = createSelector(
  [
    getFormattedColumns,
    getOriginalColumns,
    getData,
    getEmptyColumns,
    getPosAtEmptyList,
    getDataTypes,
  ],
  (
    formattedColumns,
    originalColumns,
    data,
    emptyColumns,
    posList,
    dataTypes,
  ): readonly CellItem.CellItem[] =>
    f.pipe(
      data,
      RA.map(
        f.flow(
          CellItem.recordMap(
            f.flow(
              Object.entries<CellItem.Value>,
              RA.zip(dataTypes),
              RA.map(
                ([[key, value], dataType]) =>
                  [
                    arrayLookup(formattedColumns)('')(
                      findIndex(originalColumns)(S.Eq)(key),
                    ),
                    isCorrectNumber(value.toString()) &&
                    dataType === 'numerical'
                      ? parseFloat(value.toString())
                      : value,
                  ] as const,
              ),
              RR.fromEntries,
            ),
          ),
          CellItem.recordMap((entry) =>
            f.pipe(
              posList,
              RA.zip(emptyColumns),
              RA.reduce(entry, (acc, [pos, value]) =>
                f.pipe(
                  acc,
                  Object.entries<CellItem.Value>,
                  RA.insertAt(pos, [value, '' as CellItem.Value] as const),
                  O.map(RR.fromEntries),
                  O.getOrElse(() => acc),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
)
