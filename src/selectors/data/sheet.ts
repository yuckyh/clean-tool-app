/**
 * @file This file contains the selectors for the sheet slice.
 * @module selectors/sheet
 */

import type * as CellItem from '@/lib/fp/CellItem'

import { getFlaggedCells, getSheetName } from '@/app/selectors'
import { findIndex, recordLookup } from '@/lib/array'
import { equals } from '@/lib/fp'
import { stubEq } from '@/lib/fp/Eq'
import * as Flag from '@/lib/fp/Flag'
import { createSelector } from '@reduxjs/toolkit'
import * as Eq from 'fp-ts/Eq'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as RS from 'fp-ts/ReadonlySet'
import * as f from 'fp-ts/function'
import * as S from 'fp-ts/string'
import { utils } from 'xlsx'

import { getFormattedColumns } from '../matches/format'
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
