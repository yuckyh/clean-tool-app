/**
 * @file This file contains the selectors for the sheet slice.
 * @module selectors/sheet
 */

import type { AppState } from '@/app/store'
import type * as CellItem from '@/lib/fp/CellItem'

import { findIndex, recordLookup } from '@/lib/array'
import { equals } from '@/lib/fp'
import { stubEq } from '@/lib/fp/Eq'
import * as Flag from '@/lib/fp/Flag'
import { getFormattedColumns } from '@/selectors/matches/format'
import { createSelector } from '@reduxjs/toolkit'
import * as Eq from 'fp-ts/Eq'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as RS from 'fp-ts/ReadonlySet'
import * as f from 'fp-ts/function'
import * as S from 'fp-ts/string'
import { utils } from 'xlsx'

import { getDataLength } from '.'
import { getFlaggedCells } from './cells'
import { getFormattedData } from './data'
import { getIndexRow } from './rows'

/**
 * The color map to use to fill the flagged cells
 */
const colorMap: RR.ReadonlyRecord<Flag.FlagReason, string> = {
  incorrect: 'FFFF00', // Yellow
  missing: 'FF8800', // Orange
  none: 'FFFFFF', // White
  outlier: 'DDDDDD', // Gray
  suspected: 'FF0000', // Red
} as const

/**
 * Selector function to get the file name from the app state.
 * @param state - The application state {@link AppState}
 * @param state.data - The data slice of the state.
 * @returns The file name.
 * @example
 *  const fileName = useAppSelector(getFileName)
 */
export const getFileName = ({ data }: AppState) => data.fileName

/**
 * Selector function to get the currently active sheet name from the app state.
 * @param state - The application state {@link AppState}
 * @param state.data - The data slice of the state.
 * @returns The currently active sheet name.
 * @example
 *  const sheetName = useAppSelector(getSheetName)
 */
export const getSheetName = ({ data }: AppState) => data.sheetName

/**
 *
 * @param state
 * @param state.data
 * @returns
 * @example
 */
const getSheets = ({ data }: AppState) => data.sheets

/**
 * Selector function to get the sheet names from the app state.
 * @param state - The application state {@link AppState}
 * @param state.data - The data slice of the state.
 * @returns The sheet names.
 * @example
 *  const sheetNames = useAppSelector(getSheetNames)
 */
export const getSheetNames = createSelector([getSheets], RR.keys)

/**
 * Selector function to get whether the workbook has multiple sheets.
 * @param state - The application state {@link AppState}
 * @param state.data - The data slice of the state.
 * @returns Whether the workbook has multiple sheets.
 * @example
 *  const hasMultipleSheets = useAppSelector(getHasMultipleSheets)
 */
export const getHasMultipleSheets = ({ data }: AppState) => !data.bookType

/**
 * Selector function to get whether the sheet has data.
 * @param state - The application state {@link AppState}
 * @returns Whether the sheet has data.
 * @example
 *  const hasSheet = useAppSelector(getHasSheet)
 */
export const getHasSheet = f.flow(getDataLength, Boolean)

/**
 *
 */
const getRenamedSheet = createSelector([getFormattedData], (formattedData) =>
  utils.json_to_sheet(formattedData as CellItem.CellItem[]),
)

/**
 *
 */
const getFlaggedCellsAddresses = createSelector(
  [getFlaggedCells, getFormattedColumns, getIndexRow],
  (flaggedCells, formattedColumns, indexRow) =>
    f.pipe(
      flaggedCells,
      RA.map((cell) =>
        f.pipe(
          flaggedCells,
          RA.filter(
            f.pipe(Eq.tuple(S.Eq, S.Eq, stubEq()), Flag.getEq, equals)(cell),
          ),
          (x) =>
            x.length > 1
              ? x.filter(({ value: [, , reason] }) => reason !== 'outlier')
              : x,
          RA.head,
          O.getOrElse(() => Flag.of('', '', 'outlier')),
        ),
      ),
      RS.fromReadonlyArray(Flag.Eq),
      RS.toReadonlyArray(Flag.Ord),
      RA.map(
        ({ value: [flaggedIndex, flaggedCol, flagReason] }) =>
          [
            utils.encode_cell({
              c: findIndex(formattedColumns)(S.Eq)(flaggedCol),
              r: findIndex(indexRow)(S.Eq)(flaggedIndex) + 1,
            }),
            flagReason,
          ] as const,
      ),
    ),
)

/**
 * Selector to get the formatted sheet from the app state
 * @param state - The application state
 * @returns - The formatted sheet
 */
export const getFormattedSheet = createSelector(
  [getRenamedSheet, getFlaggedCellsAddresses],
  (renamedSheet, flaggedCellsAddresses) =>
    f.pipe(
      flaggedCellsAddresses,
      RA.reduce(renamedSheet, (acc, [addr, reason]) =>
        RR.upsertAt(addr, {
          ...recordLookup(renamedSheet)({ t: 's', v: '' })(addr),
          s: {
            fill: {
              fgColor: {
                rgb: colorMap[reason],
              },
              patternType: 'solid',
            },
          },
        })(acc),
      ),
    ),
)

/**
 *
 */
export const getFormattedWorkbook = createSelector(
  [getFormattedSheet, getSheetName],
  (formattedSheet, sheetName) => {
    const newWorkbook = utils.book_new()
    utils.book_append_sheet(newWorkbook, formattedSheet, sheetName)
    return newWorkbook
  },
)
