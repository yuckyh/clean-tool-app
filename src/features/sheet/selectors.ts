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
} from '@/app/selectors'
import {
  arrayLookup,
  findIndex,
  getIndexedValue,
  head,
  recordLookup,
} from '@/lib/array'
import { equals, isCorrectNumber, refinedEq, stubEq, toString } from '@/lib/fp'
import * as CellItem from '@/lib/fp/CellItem'
import * as Flag from '@/lib/fp/Flag'
import { dump } from '@/lib/fp/logger'
import { add, divideBy, multiply } from '@/lib/fp/number'
import { getOriginalColumn } from '@/selectors/columns/selectors'
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

import {
  getFormattedColumns,
  getIndexColumnPos,
  getSearchedPos,
} from '../columns/selectors'

/**
 *
 */
const isMissingData = f.flow(
  getIndexedValue<string, string>,
  S.replace('/', ''),
  S.toLowerCase,
  equals(S.Eq),
)

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
export const getVisit = createSelector(
  [getVisits, getColParam],
  /**
   *
   * @param visits
   * @param pos
   * @returns
   * @example
   */
  (visits, pos) => arrayLookup(visits)('')(pos),
)

/**
 *
 */
export const getFirstVisit = createSelector(
  [getVisits],
  f.flow(head, f.apply('')),
)

/**
 *
 */
export const getVisitsLength = createSelector([getVisits], RA.size)

/**
 *
 */
const getColumnsByData = createSelector(
  [getData],
  f.flow(
    RA.map(RR.keys),
    head,
    f.apply([] as readonly (keyof CellItem.CellItem)[]),
  ),
)

/**
 *
 */
const getPosAtEmptyList = createSelector(
  [getColumnsByData, getOriginalColumns],
  /**
   *
   * @param dataColumns
   * @param columns
   * @returns
   * @example
   */
  (dataColumns, columns) =>
    f.pipe(
      columns,
      RA.difference(S.Eq)(dataColumns),
      RA.map(findIndex(columns)(S.Eq)),
    ),
)

/**
 *
 */
const getEmptyColumns = createSelector(
  [getPosAtEmptyList, getMatchColumns],
  /**
   *
   * @param posList
   * @param matchColumns
   * @returns
   * @example
   */
  (posList, matchColumns) =>
    f.pipe(matchColumns, arrayLookup, f.apply(''), RA.map)(posList),
)

/**
 *
 */
export const getCell = createSelector(
  [getData, getOriginalColumn, getRowParam],
  /**
   *
   * @param data
   * @param column
   * @param row
   * @returns
   * @example
   */
  (data, column, row) =>
    f.pipe(
      arrayLookup(data)(CellItem.of({}))(row),
      CellItem.fold(RR.lookup(column)),
      O.getOrElse(() => '' as CellItem.Value),
    ),
)

/**
 *
 */
export const getIndexRow = createSelector(
  [getData, getOriginalColumns, getIndexColumnPos],
  /**
   *
   * @param data
   * @param originalColumns
   * @param pos
   * @returns
   * @example
   */
  (data, originalColumns, pos) =>
    RA.map(
      f.flow(
        CellItem.fold(
          f.flow(
            recordLookup<string, CellItem.Value>,
            f.apply(''),
            f.apply(arrayLookup(originalColumns)('')(pos)),
          ),
        ),
        toString,
      ),
    )(data),
)

/**
 *
 */
export const getRow = createSelector(
  [getData, getOriginalColumns, getSearchedPos],
  /**
   *
   * @param data
   * @param originalColumns
   * @param pos
   * @returns
   * @example
   */
  (data, originalColumns, pos) =>
    RA.map(
      f.flow(
        CellItem.fold(
          f.flow(
            recordLookup<string, CellItem.Value>,
            f.apply(''),
            f.apply(arrayLookup(originalColumns)('')(pos)),
          ),
        ),
        toString,
      ),
    )(data),
)

/**
 *
 */
export const getIndexedRow = createSelector(
  [getRow, getIndexRow],
  RA.zip<string, string>,
)

/**
 *
 */
export const getIndexedRowMissings = createSelector(
  [getIndexedRow],
  RA.filter(
    f.flow(
      isMissingData,
      RA.some,
      f.apply(['', 'na', 'none', 'blank'] as const),
    ),
  ),
)

/**
 *
 */
const getBlanklessRow = createSelector(
  [getIndexedRow],
  RA.filter(
    f.flow(
      isMissingData,
      P.not,
      RA.every<string>,
      f.apply(['', 'na', 'none', 'blank'] as const),
    ),
  ),
)

/**
 *
 * @param str
 * @returns
 * @example
 */
const blankless = (str: string) => /[!,.?]{2,}/.test(str)

/**
 *
 */
export const getIndexedRowIncorrects = createSelector(
  [getBlanklessRow],
  RA.filter(f.flow(getIndexedValue, blankless)),
)

/**
 *
 */
export const getIndexedNumericalRow = createSelector(
  [getBlanklessRow],
  f.flow(
    RA.filter(f.flow(getIndexedValue, isCorrectNumber)),
    dump,
    RA.map(([index, val]) => [index, parseFloat(val)] as const),
  ),
)

/**
 *
 */
const getSortedNumericalRow = createSelector(
  [getIndexedNumericalRow],
  f.flow(RA.map(getIndexedValue), RA.sort(N.Ord)),
)

/**
 *
 */
const getFences = createSelector(
  [getSortedNumericalRow],
  /**
   * Calculates the fences for outlier detection using the provided sorted numerical row.
   * @param row - The sorted numerical row to calculate the fences from.
   * @returns The fences tuple.
   * @example
   */
  (row) =>
    f.pipe(
      RA.makeBy(
        3,
        f.flow(
          add(1),
          multiply(row.length),
          divideBy,
          f.apply(4),
          E.fromPredicate((x) => x % 1 === 0, f.identity),
          E.getOrElse(Math.ceil),
          (x) => [x - 1, x] as const,
          RA.foldMap(N.MonoidSum)(arrayLookup(row)(0)),
          f.flip(divideBy)(2),
        ),
      ) as readonly [number, number, number],
      ([q1, , q3]) => [2.5 * q1 - 1.5 * q3, 2.5 * q3 - 1.5 * q1] as const,
    ),
)

/**
 *
 */
export const getOutliers = createSelector(
  [getIndexedNumericalRow, getFences],
  /**
   * Selects the values from the indexed numerical row that are outliers, using the provided row and fences.
   * @param row - The indexed numerical row to select from.
   * @param fences - The fences to use for outlier detection.
   * @param fences."0" - The lower fence.
   * @param fences."1" - The upper fence.
   * @returns An array of values that are outliers.
   * @example
   */
  (row, [lower, upper]) =>
    f.pipe(
      row,
      RA.filter(([, value]) => value < lower || value > upper),
    ),
)

/**
 * Function to select non outlier values from the given indexed numerical row.
 * @param state - The application state {@link app/store.AppState AppState}
 * @param column - The column to search for the row
 * @param visit - The visit to search for the row
 * @returns - An array of non outlier values
 */
export const getNotOutliers = createSelector(
  [getIndexedNumericalRow, getFences],
  /**
   * Selects the values from the indexed numerical row that are not outliers, using the provided row and fences
   * @param row - The indexed numerical row to select from
   * @param fences - The fences to use for outlier detection
   * @param fences."0" - The lower fence
   * @param fences."1" - The upper fence
   * @returns - An array of non outlier values
   * @example
   */
  (row, [lower, upper]) =>
    f.pipe(
      row,
      RA.filter(
        f.flow(getIndexedValue, (value) => value > lower && value < upper),
      ),
    ),
)

/**
 *
 */
export const getFlaggedRows = createSelector(
  [getFlaggedCells, getTitleParam, getReasonParam],
  /**
   * Selects the flagged rows from the app state using the provided flagged cells, title, and reason.
   * @param flaggedCells - The flagged cells to select from.
   * @param title - The title to use for selection.
   * @param reason - The flag reason.
   * @returns An array of flagged rows.
   * @example
   */
  (flaggedCells, title, reason) =>
    f.pipe(
      Eq.tuple(
        stubEq<string>(),
        S.Eq,
        refinedEq<Flag.FlagReason, string>(S.Eq),
      ),
      Flag.getEq,
      equals,
      f.apply(Flag.of('', title, reason)),
      RA.filter<Flag.Flag>,
      f.apply(flaggedCells),
      RS.fromReadonlyArray(Flag.Eq),
      RS.map(S.Eq)(({ value: [index] }) => index),
    ),
)

/**
 *
 */
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
   * @param originalColumns - The columns to use for data formatting.
   * @param data - The data to format.
   * @param emptyColumns - The empty columns to use for data formatting.
   * @param posList - The positions at empty list to use for data formatting.
   * @param dataTypes - The data types to use for data formatting.
   * @returns An array of formatted cell items.
   * @example
   */
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
                    f.pipe(
                      arrayLookup(formattedColumns)('')(
                        findIndex(originalColumns)(S.Eq)(key),
                      ),
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

/**
 *
 */
const getRenamedSheet = createSelector(
  [getFormattedData],
  /**
   * Renames the sheet using the formatted data.
   * @param formattedData - The formatted data to use for renaming.
   * @returns The renamed sheet.
   * @example
   */
  (formattedData) => utils.json_to_sheet(formattedData as CellItem.CellItem[]),
)

const getFlaggedCellsAddresses = createSelector(
  [getFlaggedCells, getFormattedColumns, getIndexRow],
  /**
   * Selects the flagged cells addresses from the flagged cells, formatted columns, and index row.
   * @param flaggedCells - The flagged cells to select from.
   * @param formattedColumns - The formatted columns to use for address encoding.
   * @param indexRow - The index row to use for address encoding.
   * @returns An array of flagged cells addresses.
   * @example
   */
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
  /**
   * Formats the sheet using the renamed sheet and flagged cells addresses.
   * @param renamedSheet - The renamed sheet to format.
   * @param flaggedCellsAddresses - The flagged cells addresses to use for formatting.
   * @returns The formatted sheet.
   * @example
   */
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
  /**
   * Creates a workbook using the formatted sheet and sheet name.
   * @param formattedSheet - The sheet that has been formatted with the flagged cells
   * @param sheetName - The sheet name to use for creating the workbook
   * @returns The formatted workbook.
   * @example
   */
  (formattedSheet, sheetName) => {
    const newWorkbook = utils.book_new()
    utils.book_append_sheet(newWorkbook, formattedSheet, sheetName)
    return newWorkbook
  },
)
