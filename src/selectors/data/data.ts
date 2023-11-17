/**
 * @file This file contains the data selectors for the data slice.
 * @module selectors/data/data
 */

/* eslint-disable
  import/prefer-default-export
*/

import { arrayLookup, findIndex } from '@/lib/array'
import { isCorrectNumber } from '@/lib/fp'
import * as CellItem from '@/lib/fp/CellItem'
import { getDataTypes } from '@/selectors/matches/dataTypes'
import { getFormattedColumns } from '@/selectors/matches/format'
import { createSelector } from '@reduxjs/toolkit'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as f from 'fp-ts/function'
import * as S from 'fp-ts/string'

import { getData } from '.'
import {
  getEmptyColumns,
  getOriginalColumns,
  getPosAtEmptyList,
} from './columns'

/**
 * Selector function to get the formatted data.
 *
 * To get the formatted data, the original, formatted, and empty columns are used to create a new array of {@link CellItem.CellItem CellItem} objects.
 *
 * Using the data types, the values of the {@link CellItem.CellItem CellItem} objects are converted to the correct type.
 *
 * The empty columns are then used to insert empty values into the {@link CellItem.CellItem CellItem} objects.
 * @param state - The application state {@link app/store.AppState AppState}
 * @returns The formatted data
 * @example
 *  const getRenamedSheet = createSelector([getFormattedData],
 *    (formattedData) =>
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
                  isCorrectNumber(value.toString()) && dataType === 'numerical'
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
      RA.map,
    )(data),
)
