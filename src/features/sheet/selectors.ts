import {
  getColParam,
  getData,
  getDataTypes,
  getFlaggedCells,
  getMatchColumns,
  getOriginalColumns,
  getReasonParam,
  getRowParam,
  getSheetName,
  getTitleParam,
  getVisits,
  searchPos,
} from '@/app/selectors'
import { getIndexedValue, lookup, stringLookup } from '@/lib/array'
import {
  FlagEq,
  FlagOrd,
  equals,
  isCorrectNumber,
  strEquals,
  stubEq,
  toString,
  typedEq,
} from '@/lib/fp'
import { add, divideBy, multiply } from '@/lib/number'
import { getOriginalColumn } from '@/selectors/columnsSelectors'
import { createSelector } from '@reduxjs/toolkit'
import * as E from 'fp-ts/Either'
import * as Eq from 'fp-ts/Eq'
import * as O from 'fp-ts/Option'
import * as P from 'fp-ts/Predicate'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as RS from 'fp-ts/ReadonlySet'
import * as f from 'fp-ts/function'
import * as N from 'fp-ts/number'
import * as S from 'fp-ts/string'
import { utils } from 'xlsx'

import type { Flag, FlagReason } from './reducers'

import {
  getFormattedColumns,
  getIndices,
  getSearchedPos,
} from '../columns/selectors'

export const getVisit = createSelector(
  [getVisits, getColParam],
  (visits, pos) => stringLookup(visits)(pos),
)

const getColumnsByData = createSelector([getData], (data) =>
  f.pipe(
    data,
    RA.map(RR.keys),
    RA.head,
    f.pipe([] as readonly string[], f.constant, O.getOrElse),
  ),
)

const getPosAtEmptyList = createSelector(
  [getColumnsByData, getOriginalColumns],
  (dataColumns, columns) =>
    f.pipe(
      columns,
      RA.difference(S.Eq)(dataColumns),
      RA.map(
        f.flow(
          strEquals,
          RA.findIndex,
          f.apply(columns),
          f.pipe(-1, f.constant, O.getOrElse),
        ),
      ),
    ),
)

const getEmptyColumns = createSelector(
  [getPosAtEmptyList, getMatchColumns],
  (posList, matchColumns) =>
    f.pipe(matchColumns, stringLookup, RA.map, f.apply(posList)),
)

export const getCell = createSelector(
  [getData, getOriginalColumn, getRowParam],
  (data, column, row) =>
    f.pipe(
      data,
      RA.lookup(row),
      O.flatMap(RR.lookup(column)),
      f.pipe('', f.constant, O.getOrElse),
    ),
)

export const getIndexRow = createSelector(
  [getData, getOriginalColumns, getIndices, getVisits],
  (data, columns, indices, visits) =>
    f.pipe(
      data,
      RA.map(
        f.flow(
          RR.lookup(
            stringLookup(columns)(
              searchPos(indices, visits, 'sno', stringLookup(visits)(0)),
            ),
          ),
          f.pipe('' as string, f.constant, O.getOrElse),
          toString,
        ),
      ),
    ),
)

export const getRow = createSelector(
  [getData, getOriginalColumns, getSearchedPos],
  (data, columns, pos) =>
    f.pipe(
      data,
      RA.map(
        f.flow(
          RR.lookup(stringLookup(columns)(pos)),
          f.pipe('' as string, f.constant, O.getOrElse),
          toString,
        ),
      ),
    ),
)

export const getIndexedRow = createSelector(
  [getRow, getIndexRow],
  (row, indexRow) => RA.zip(row)(indexRow),
)

export const getIndexedRowMissings = createSelector(
  [getIndexedRow],
  RA.filter(
    f.flow(
      getIndexedValue,
      S.replace('/', ''),
      S.toLowerCase,
      strEquals,
      RA.some<string>,
      f.apply(['', 'na', 'none', 'blank'] as const),
    ),
  ),
)

const getBlanklessRow = createSelector(
  [getIndexedRow],
  RA.filter(
    f.flow(
      getIndexedValue,
      S.replace('/', ''),
      S.toLowerCase,
      strEquals,
      P.not,
      RA.every<string>,
      f.apply(['', 'na', 'none', 'blank'] as const),
    ),
  ),
)

export const getIndexedRowIncorrects = createSelector(
  [getBlanklessRow],
  RA.filter(f.flow(getIndexedValue, (val) => /[!,.?]{2,}/.test(val))),
)

export const getIndexedNumericalRow = createSelector(
  [getBlanklessRow],
  f.flow(
    RA.filter(f.flow(getIndexedValue, isCorrectNumber)),
    RA.map(([index, val]) => [index, parseFloat(val)] as const),
  ),
)

const getSortedNumericalRow = createSelector(
  [getIndexedNumericalRow],
  f.flow(RA.map(getIndexedValue), RA.sort(N.Ord)),
)

const getFences = createSelector(
  [getSortedNumericalRow],
  /**
   * Calculates the fences for outlier detection using the provided sorted numerical row.
   * @param row - The sorted numerical row to calculate the fences from.
   * @returns The fences tuple.
   */
  (row) =>
    f.pipe(
      RA.makeBy(
        3,
        f.flow(
          add(1),
          multiply(row.length),
          f.flip(divideBy)(4),
          E.fromPredicate((x) => x % 1 === 0, f.identity),
          E.getOrElse(Math.ceil),
          (x) => [x - 1, x] as const,
          f.pipe(lookup(row)(0), RA.map),
          RA.reduce(0, N.MonoidSum.concat),
          f.flip(divideBy)(2),
        ),
      ) as readonly [number, number, number],
      ([q1, , q3]) => [2.5 * q1 - 1.5 * q3, 2.5 * q3 - 1.5 * q1] as const,
    ),
)

export const getOutliers = createSelector(
  [getIndexedNumericalRow, getFences],
  /**
   * Selects the values from the indexed numerical row that are outliers, using the provided row and fences.
   * @param row - The indexed numerical row to select from.
   * @param fences - The fences to use for outlier detection.
   * @param fences."0"
   * @param fences."1"
   * @returns An array of values that are outliers.
   */
  (row, [lower, upper]) =>
    f.pipe(
      row,
      RA.filter(([, value]) => value < lower || value > upper),
    ),
)

export const getNotOutliers = createSelector(
  [getIndexedNumericalRow, getFences],
  /**
   * Selects the values from the indexed numerical row that are not outliers, using the provided row and fences.
   * @param row - The indexed numerical row to select from.
   * @param fences - The fences to use for outlier detection.
   * @param fences."0"
   * @param fences."1"
   * @returns An array of values that are not outliers.
   */
  (row, [lower, upper]) =>
    f.pipe(
      row,
      RA.filter(([, value]) => value > lower && value < upper),
    ),
)

export const getFlaggedRows = createSelector(
  [getFlaggedCells, getTitleParam, getReasonParam],
  /**
   * Selects the flagged rows from the app state using the provided flagged cells, title, and reason.
   * @param flaggedCells - The flagged cells to select from.
   * @param title - The title to use for selection.
   * @param reason - The reason to use for selection.
   * @returns An array of flagged rows.
   */
  (flaggedCells, title, reason) =>
    f.pipe(
      Eq.tuple(stubEq<string>(), S.Eq, typedEq<FlagReason, string>(S.Eq)),
      equals,
      f.apply(['', title, reason] as Flag),
      RA.filter<Flag>,
      f.apply(flaggedCells),
      RS.fromReadonlyArray(FlagEq),
      RS.map(S.Eq)(([index]) => index),
    ),
)

const getFormattedData = createSelector(
  [
    getFormattedColumns,
    getOriginalColumns,
    getData,
    getEmptyColumns,
    getPosAtEmptyList,
    getDataTypes,
  ],
  /**
   * Formats the data using the provided columns, data, empty columns, positions at empty list, and data types.
   * @param formattedColumns - The formatted columns to use for data formatting.
   * @param columns - The columns to use for data formatting.
   * @param data - The data to format.
   * @param emptyColumns - The empty columns to use for data formatting.
   * @param posList - The positions at empty list to use for data formatting.
   * @param dataTypes - The data types to use for data formatting.
   * @returns An array of formatted cell items.
   */
  (
    formattedColumns,
    columns,
    data,
    emptyColumns,
    posList,
    dataTypes,
  ): readonly CellItem[] =>
    f.pipe(
      data,
      RA.map(
        f.flow(
          Object.entries<string>,
          RA.zip(dataTypes),
          RA.map(
            ([[key, value], dataType]) =>
              [
                f.pipe(
                  formattedColumns,
                  stringLookup,
                  O.map,
                  f.apply(f.pipe(key, strEquals, RA.findIndex)(columns)),
                  f.pipe('', f.constant, O.getOrElse),
                  toString,
                ),
                isCorrectNumber(value) && dataType === 'numerical'
                  ? parseFloat(value)
                  : value,
              ] as const,
          ),
          RR.fromEntries,
        ),
      ),
      RA.map((entry) =>
        f.pipe(
          posList,
          RA.zip(emptyColumns),
          RA.reduce(entry, (acc, [pos, value]) =>
            f.pipe(
              acc,
              Object.entries,
              RA.insertAt(pos, [value, '' as number | string] as const),
              O.map(RR.fromEntries),
              f.pipe(acc, f.constant, O.getOrElse),
            ),
          ),
        ),
      ),
    ) as readonly CellItem[],
)

const getRenamedSheet = createSelector(
  [getFormattedData],
  /**
   * Renames the sheet using the formatted data.
   * @param formattedData - The formatted data to use for renaming.
   * @returns The renamed sheet.
   */
  (formattedData) => utils.json_to_sheet(formattedData as CellItem[]),
)

const getFlaggedCellsAddresses = createSelector(
  [getFlaggedCells, getFormattedColumns, getIndexRow],
  /**
   * Selects the flagged cells addresses from the flagged cells, formatted columns, and index row.
   * @param flaggedCells - The flagged cells to select from.
   * @param formattedColumns - The formatted columns to use for address encoding.
   * @param indexRow - The index row to use for address encoding.
   * @returns An array of flagged cells addresses.
   */
  (flaggedCells, formattedColumns, indexRow) =>
    f.pipe(
      flaggedCells,
      RA.map((cell) =>
        f.pipe(
          flaggedCells,
          RA.filter((otherCell) =>
            Eq.tuple(S.Eq, S.Eq, stubEq()).equals(cell, otherCell),
          ),
          (x) =>
            x.length > 1 ? x.filter(([, , reason]) => reason !== 'outlier') : x,
          RA.head,
          f.pipe(['', '', 'outlier'] as Flag, f.constant, O.getOrElse),
        ),
      ),
      RS.fromReadonlyArray(FlagEq),
      RS.toReadonlyArray(FlagOrd),
      RA.map(
        ([flaggedIndex, flaggedCol, flagReason]) =>
          [
            utils.encode_cell({
              c: f.pipe(
                formattedColumns,
                RA.findIndex(strEquals(flaggedCol)),
                f.pipe(Infinity, f.constant, O.getOrElse),
              ),
              r:
                f.pipe(
                  indexRow,
                  RA.findIndex(strEquals(flaggedIndex)),
                  f.pipe(Infinity, f.constant, O.getOrElse),
                ) + 1,
            }),
            flagReason,
          ] as const,
      ),
    ),
)

/**
 * The color map to use to fill the flagged cells
 */
const colorMap: Record<FlagReason, string> = {
  incorrect: 'FFFF00', // Yellow
  missing: 'FF8800', // Orange
  outlier: 'DDDDDD', // Gray
  suspected: 'FF0000', // Red
} as const

export const getFormattedSheet = createSelector(
  [getRenamedSheet, getFlaggedCellsAddresses],
  /**
   * Formats the sheet using the renamed sheet and flagged cells addresses.
   * @param renamedSheet - The renamed sheet to format.
   * @param flaggedCellsAddresses - The flagged cells addresses to use for formatting.
   * @returns The formatted sheet.
   */
  (renamedSheet, flaggedCellsAddresses) =>
    f.pipe(
      flaggedCellsAddresses,
      RA.reduce(renamedSheet, (acc, [addr, reason]) =>
        RR.upsertAt(addr, {
          ...f.pipe(
            renamedSheet,
            RR.lookup(addr),
            f.pipe({ t: 's', v: '' }, f.constant, O.getOrElse),
          ),
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

export const getFormattedWorkbook = createSelector(
  [getFormattedSheet, getSheetName],
  /**
   * Creates a workbook using the formatted sheet and sheet name.
   * @param formattedSheet - The formatted sheet to use for creating the workbook.
   * @param writtenSheet
   * @param sheetName - The sheet name to use for creating the workbook.
   * @returns The formatted workbook.
   */
  (writtenSheet, sheetName) => {
    const newWorkbook = utils.book_new()
    utils.book_append_sheet(newWorkbook, writtenSheet, sheetName)
    return newWorkbook
  },
)
