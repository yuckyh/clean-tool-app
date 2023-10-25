import {
  getColumns,
  getData,
  getDataTypes,
  getFlaggedCells,
  getPosParam,
  getReasonParam,
  getSheetName,
  getTitleParam,
  getVisits,
  searchPos,
} from '@/app/selectors'
import { getIndexedValue, numberLookup, stringLookup } from '@/lib/array'
import { strEquals } from '@/lib/fp'
import { add, divideBy, multiply } from '@/lib/number'
import { createSelector } from '@reduxjs/toolkit'
import * as E from 'fp-ts/Either'
import * as Eq from 'fp-ts/Eq'
import * as O from 'fp-ts/Option'
import * as Ord from 'fp-ts/Ord'
import * as P from 'fp-ts/Predicate'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as RS from 'fp-ts/ReadonlySet'
import * as f from 'fp-ts/function'
import * as N from 'fp-ts/number'
import * as S from 'fp-ts/string'
import { utils } from 'xlsx'

import type { Flag } from './reducers'

import {
  getFormattedColumns,
  getIndices,
  getSearchedPos,
} from '../columns/selectors'

export const getColumnsLength = createSelector(
  [getColumns],
  (columns) => columns.length,
)

const getEmptyColumns = createSelector([getData, getColumns], (data, columns) =>
  f.pipe(
    RS.fromReadonlyArray(S.Eq)(columns),
    RS.difference(S.Eq)(
      RS.fromReadonlyArray(S.Eq)(
        f.pipe(
          data,
          RA.map(RR.keys),
          RA.head,
          f.pipe([] as readonly string[], f.constant, O.getOrElse),
        ),
      ),
    ),
    RS.toReadonlyArray(S.Ord),
  ),
)

export const getColumn = createSelector(
  [getColumns, getPosParam],
  (columns, pos) => stringLookup(columns)(pos),
)

export const getVisit = createSelector(
  [getVisits, getPosParam],
  (visits, pos) => stringLookup(visits)(pos),
)

export const getColumnComparer = createSelector(
  [getColumns],
  (columns) => (posA: number, posB: number) =>
    f.pipe(
      [posA, posB] as const,
      f.pipe(columns, stringLookup, RA.map),
      (x) => f.identity(x) as [string, string],
      f.tupled(S.Ord.compare),
    ),
)

export const getIndexRow = createSelector(
  [getData, getColumns, getIndices, getVisits],
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
          f.pipe('' as Property<CellItem>, f.constant, O.getOrElse),
          (x) => x.toString(),
        ),
      ),
    ),
)

export const getRow = createSelector(
  [getData, getColumns, getSearchedPos],
  (data, columns, pos) =>
    f.pipe(
      data,
      RA.map(
        f.flow(
          RR.lookup(stringLookup(columns)(pos)),
          f.pipe('' as Property<CellItem>, f.constant, O.getOrElse),
          (x) => x.toString(),
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
  RA.filter(([, cell]) =>
    f.pipe(
      ['', 'na', 'none', 'blank'] as const,
      RA.some(
        (marker) => marker === f.pipe(cell, S.replace('/', ''), S.toLowerCase),
      ),
    ),
  ),
)

const getBlanklessRow = createSelector(
  [getIndexedRow],
  RA.filter(([, cell]) =>
    f.pipe(
      ['', 'na', 'none', 'blank'] as const,
      RA.every(
        (marker) => marker !== f.pipe(cell, S.replace('/', ''), S.toLowerCase),
      ),
    ),
  ),
)

export const getIndexedRowIncorrects = createSelector(
  [getBlanklessRow],
  RA.filter(f.flow(getIndexedValue, (val) => /[!,.?]{2,}/.test(val))),
)

const getIndexedNumericalRow = createSelector(
  [getBlanklessRow],
  f.flow(
    RA.filter(f.flow(getIndexedValue, (val) => !/[!,.?]{2,}/.test(val))),
    RA.map(([index, val]) => [index, parseFloat(val)] as const),
  ),
)

export const getCleanNumericalRow = createSelector(
  [getIndexedNumericalRow],
  RA.filter(f.flow(getIndexedValue, P.not(Number.isNaN))),
)

const getSortedNumericalRow = createSelector(
  [getCleanNumericalRow],
  f.flow(RA.map(f.flow(getIndexedValue, Number)), RA.sort(N.Ord)),
)

const getFences = createSelector([getSortedNumericalRow], (row) =>
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
        f.pipe(row, numberLookup, RA.map),
        RA.reduce(0, N.MonoidSum.concat),
        f.flip(divideBy)(2),
      ),
    ) as readonly [number, number, number],
    ([q1, , q3]) => [2.5 * q1 - 1.5 * q3, 2.5 * q3 - 1.5 * q1] as const,
  ),
)

export const getOutliers = createSelector(
  [getCleanNumericalRow, getFences],
  (row, [lower, upper]) =>
    f.pipe(
      row,
      RA.filter(([, value]) => value < lower || value > upper),
    ),
)

export const getNotOutliers = createSelector(
  [getCleanNumericalRow, getFences],
  (row, [lower, upper]) =>
    f.pipe(
      row,
      RA.filter(([, value]) => value > lower && value < upper),
    ),
)

export const FlagEq: Eq.Eq<Flag> = Eq.tuple(S.Eq, S.Eq, S.Eq)
export const FlagOrd: Ord.Ord<Flag> = Ord.tuple(S.Ord, S.Ord, S.Ord)

export const getFlaggedRows = createSelector(
  [getFlaggedCells, getTitleParam, getReasonParam],
  (flaggedCells, title, reason) =>
    f.pipe(
      flaggedCells,
      RA.filter(
        ([, flagTitle, flagReason]) =>
          flagTitle === title && flagReason === reason,
      ),
      RS.fromReadonlyArray(FlagEq),
      RS.map(S.Eq)(([index]) => index),
    ),
)

const getFormattedData = createSelector(
  [getFormattedColumns, getColumns, getData, getEmptyColumns, getDataTypes],
  (
    formattedColumns,
    columns,
    data,
    emptyColumns,
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
                ),
                value &&
                !Number.isNaN(parseFloat(value)) &&
                !/[!,.?]{2,}/.test(value) &&
                dataType === 'numerical'
                  ? parseFloat(value)
                  : value,
              ] as const,
          ),
          RR.fromEntries,
        ),
      ),
      RA.map((entry) =>
        f.pipe(
          emptyColumns,
          RA.reduce(entry, (acc, curr) =>
            RR.upsertAt(curr, '' as number | string)(acc),
          ),
        ),
      ),
    ) as readonly CellItem[],
)

const getFormattedSheet = createSelector([getFormattedData], (formattedData) =>
  utils.json_to_sheet(formattedData as CellItem[]),
)

const getFlaggedCellsAddresses = createSelector(
  [getFlaggedCells, getFormattedColumns, getIndexRow],
  (flaggedCells, formattedColumns, indexRow) =>
    f.pipe(
      flaggedCells,
      RA.map(([firstIndex, firstColumn]) =>
        f.pipe(
          flaggedCells,
          RA.filter(
            ([secondIndex, secondColumn]) =>
              strEquals(firstIndex)(secondIndex) &&
              strEquals(firstColumn)(secondColumn),
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
              r: f.pipe(
                indexRow,
                RA.findIndex(strEquals(flaggedIndex)),
                f.pipe(Infinity, f.constant, O.getOrElse),
              ),
            }),
            flagReason,
          ] as const,
      ),
    ),
)

const colorMap = f.pipe(
  {
    incorrect: 'FF8800FF', // RRGGBBAA
    missing: 'FFFF00FF',
    outlier: '0000FFFF',
    suspected: '0000FFFF',
  } as const,
  RR.map(f.flow(S.slice(1, 7), S.toUpperCase)),
)

export const getWrittenSheet = createSelector(
  [getFormattedSheet, getFlaggedCellsAddresses],
  (formattedSheet, flaggedCellsAddresses) =>
    f.pipe(
      flaggedCellsAddresses,
      RA.reduce(formattedSheet, (acc, [addr, reason]) =>
        RR.upsertAt(addr, {
          ...f.pipe(
            formattedSheet,
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

export const getWrittenWorkbook = createSelector(
  [getWrittenSheet, getSheetName],
  (writtenSheet, sheetName) => {
    const newWorkbook = utils.book_new()
    utils.book_append_sheet(newWorkbook, writtenSheet, sheetName)
    return newWorkbook
  },
)
