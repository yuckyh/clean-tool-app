import { createSelector } from '@reduxjs/toolkit'
import {
  findIndex,
  property,
  toLength,
  isString,
  template,
  replace,
  toLower,
  filter,
  reduce,
  flow,
  some,
  map,
  zip,
  nth,
} from 'lodash/fp'
import { getPosParam, getColumns, getData } from '@/app/selectors'

import { getSearchedPos, getIndices } from '../columns/selectors'
import { just } from '@/lib/monads'

export const getColumnsLength = createSelector([getColumns], toLength)

function localeCompare(acc: number | string, prev: string) {
  return isString(acc) ? acc.localeCompare(prev) : prev
}

export const getColumnComparer = createSelector(
  [getColumns],
  (columns) =>
    (...args: [number, number]) =>
      flow(
        map<number, string>((pos) => nth(pos)(columns) ?? ''),
        reduce<string, number | string>(localeCompare)(0),
      )(args),
)

export const getColumn = createSelector(
  [getColumns, getPosParam],
  (columns, pos) => nth(pos)(columns) ?? '',
)

const getIndexRow = createSelector(
  [getData, getColumns, getIndices],
  (data, columns, indices) =>
    map<CellItem, string>(
      (row) =>
        `${property<CellItem, string>(
          nth(
            findIndex(
              ([matchColumn, matchVisit]: readonly [string, number]) =>
                matchColumn === 'sno' && matchVisit === 0,
            )(indices),
          )(columns) ?? '',
        )(row)}`,
    )(data),
)

export const getRow = createSelector(
  [getData, getColumns, getSearchedPos],
  (data, columns, pos) =>
    map((row) => `${property(nth(pos)(columns) ?? '')(row)}`)(data),
)

export const getIndexedRow = createSelector(
  [getRow, getIndexRow],
  (row, indexRow) =>
    flow(
      zip(row),
      map(([value = '', index = '']) => [value, index] as const),
    )(indexRow),
)

export const getRowBlanks = createSelector(
  [getIndexedRow],
  filter(([value]) =>
    some<string>((marker) => marker === replace('/', '')(toLower(value)))([
      '',
      'na',
      'none',
      'blank',
    ]),
  ),
)

const getBlanklessRow = createSelector([getRow], (row) =>
  row.filter((value) =>
    ['', 'na', 'none', 'blank'].every(
      (marker) => marker !== value.toLowerCase().replace('/', ''),
    ),
  ),
)

const getParsedCategoricalRow = createSelector([getBlanklessRow], (row) =>
  row.map((value) => value.replace('/', '')),
)

const getParsedNumericalRow = createSelector([getBlanklessRow], (row) =>
  row.map((value) => value.replace(/[!,.?]+/, '.')).map(Number),
)

const getIndexedParsedCategoricalRow = createSelector(
  [getParsedCategoricalRow, getIndexRow],
  (row, indexRow) =>
    zip(row, indexRow)
      .filter(([value]) => value !== undefined)
      .map(([value = '', index = '']) => [value, index] as const),
)

const getIndexedParsedNumericalRow = createSelector(
  [getParsedNumericalRow, getIndexRow],
  (row, indexRow) =>
    zip(row, indexRow)
      .filter(([value]) => value !== undefined)
      .map(([value = 0, index = '']) => [value, index] as const),
)

export const getRowIncorrects = createSelector(
  [getIndexedParsedCategoricalRow],
  (row) => row.filter(([value]) => just(value)(Number)(Number.isNaN)()),
)

export const getCleanNumericalRow = createSelector(
  [getIndexedParsedNumericalRow],
  (row) => row.filter((value) => just(value)(Number)(Number.isNaN)()),
)
