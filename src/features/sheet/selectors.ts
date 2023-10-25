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
import { getIndexedValue, stringLookup } from '@/lib/array'
import { strEquals } from '@/lib/fp'
import { createSelector } from '@reduxjs/toolkit'
import * as Eq from 'fp-ts/Eq'
import * as O from 'fp-ts/Option'
import * as Ord from 'fp-ts/Ord'
import * as P from 'fp-ts/Predicate'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as RS from 'fp-ts/ReadonlySet'
import { apply, constant, flow, identity, pipe, tupled } from 'fp-ts/function'
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
  pipe(
    RS.fromReadonlyArray(S.Eq)(columns),
    RS.difference(S.Eq)(
      RS.fromReadonlyArray(S.Eq)(
        pipe(
          data,
          RA.map(RR.keys),
          RA.head,
          pipe([] as readonly string[], constant, O.getOrElse),
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
    pipe(
      [posA, posB] as const,
      pipe(columns, stringLookup, RA.map),
      (x) => identity(x) as [string, string],
      tupled(S.Ord.compare),
    ),
)

export const getIndexRow = createSelector(
  [getData, getColumns, getIndices, getVisits],
  (data, columns, indices, visits) =>
    pipe(
      data,
      RA.map(
        flow(
          RR.lookup(
            stringLookup(columns)(
              searchPos(indices, visits, 'sno', stringLookup(visits)(0)),
            ),
          ),
          pipe('' as Property<CellItem>, constant, O.getOrElse),
          (x) => x.toString(),
        ),
      ),
    ),
)

export const getRow = createSelector(
  [getData, getColumns, getSearchedPos],
  (data, columns, pos) =>
    pipe(
      data,
      RA.map(
        flow(
          RR.lookup(stringLookup(columns)(pos)),
          pipe('' as Property<CellItem>, constant, O.getOrElse),
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
    pipe(
      ['', 'na', 'none', 'blank'] as const,
      RA.some(
        (marker) => marker === pipe(cell, S.replace('/', ''), S.toLowerCase),
      ),
    ),
  ),
)

const getBlanklessRow = createSelector(
  [getIndexedRow],
  RA.filter(([, cell]) =>
    pipe(
      ['', 'na', 'none', 'blank'] as const,
      RA.every(
        (marker) => marker !== pipe(cell, S.replace('/', ''), S.toLowerCase),
      ),
    ),
  ),
)

export const getIndexedRowIncorrects = createSelector(
  [getBlanklessRow],
  RA.filter(flow(getIndexedValue, (val) => /[!,.?]{2,}/.test(val))),
)

const getIndexedNumericalRow = createSelector(
  [getBlanklessRow],
  flow(
    RA.filter(flow(getIndexedValue, (val) => !/[!,.?]{2,}/.test(val))),
    RA.map(([index, val]) => [index, parseFloat(val)] as const),
  ),
)

export const getCleanNumericalRow = createSelector(
  [getIndexedNumericalRow],
  RA.filter(flow(getIndexedValue, P.not(Number.isNaN))),
)

export const FlagEq: Eq.Eq<Flag> = Eq.tuple(S.Eq, S.Eq, S.Eq)
export const FlagOrd: Ord.Ord<Flag> = Ord.tuple(S.Ord, S.Ord, S.Ord)

export const getFlaggedRows = createSelector(
  [getFlaggedCells, getTitleParam, getReasonParam],
  (flaggedCells, title, reason) =>
    pipe(
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
    pipe(
      data,
      RA.map(
        flow(
          Object.entries<string>,
          RA.zip(dataTypes),
          RA.map(
            ([[key, value], dataType]) =>
              [
                pipe(
                  formattedColumns,
                  stringLookup,
                  O.map,
                  apply(pipe(key, strEquals, RA.findIndex)(columns)),
                  pipe('', constant, O.getOrElse),
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
        pipe(
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
    pipe(
      flaggedCells,
      RA.map(([firstIndex, firstColumn]) =>
        pipe(
          flaggedCells,
          RA.filter(
            ([secondIndex, secondColumn]) =>
              strEquals(firstIndex)(secondIndex) &&
              strEquals(firstColumn)(secondColumn),
          ),
          (x) =>
            x.length > 1 ? x.filter(([, , reason]) => reason !== 'outlier') : x,
          RA.head,
          pipe(['', '', 'outlier'] as Flag, constant, O.getOrElse),
        ),
      ),
      RS.fromReadonlyArray(FlagEq),
      RS.toReadonlyArray(FlagOrd),
      RA.map(
        ([flaggedIndex, flaggedCol, flagReason]) =>
          [
            utils.encode_cell({
              c: pipe(
                formattedColumns,
                RA.findIndex(strEquals(flaggedCol)),
                pipe(Infinity, constant, O.getOrElse),
              ),
              r: pipe(
                indexRow,
                RA.findIndex(strEquals(flaggedIndex)),
                pipe(Infinity, constant, O.getOrElse),
              ),
            }),
            flagReason,
          ] as const,
      ),
    ),
)

const colorMap = pipe(
  {
    incorrect: 'FF00FFFF', // RRGGBBAA
    missing: 'FFFF00FF',
    outlier: 'FF0000FF',
    suspected: 'FF0000FF',
  } as const,
  RR.map(flow(S.slice(1, 7), S.toUpperCase)),
)

export const getWrittenSheet = createSelector(
  [getFormattedSheet, getFlaggedCellsAddresses],
  (formattedSheet, flaggedCellsAddresses) =>
    pipe(
      flaggedCellsAddresses,
      RA.reduce(formattedSheet, (acc, [addr, reason]) =>
        RR.upsertAt(addr, {
          ...pipe(
            formattedSheet,
            RR.lookup(addr),
            pipe({ t: 's', v: '' }, constant, O.getOrElse),
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
