import { createSelector } from '@reduxjs/toolkit'
import {
  isUndefined,
  findIndex,
  defaultTo,
  property,
  toLength,
  isString,
  toNumber,
  replace,
  toLower,
  isEqual,
  filter,
  reduce,
  negate,
  isNaN,
  every,
  flow,
  some,
  map,
  zip,
  nth,
} from 'lodash/fp'
import { getPosParam, getColumns, getData } from '@/app/selectors'

import { getSearchedPos, getIndices } from '../columns/selectors'

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
      )(args) as number,
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

const getBlanklessRow = createSelector(
  [getRow],
  filter((value) =>
    every(flow(toLower, replace('/')(''), isEqual(value), negate))([
      '',
      'na',
      'none',
      'blank',
    ]),
  ),
)

const getParsedCategoricalRow = createSelector(
  [getBlanklessRow],
  map(replace('/')('')),
)

const getParsedNumericalRow = createSelector(
  [getBlanklessRow],
  map(flow(replace(/[!,.?]+/)('.'), toNumber)),
)

const getIndexedParsedCategoricalRow = createSelector(
  [getParsedCategoricalRow, getIndexRow],
  (row, indexRow) =>
    flow(
      zip(row),
      filter<[undefined | string, undefined | string]>(
        flow(nth(0), isUndefined, negate),
      ),
      map(map<undefined | string, string>(defaultTo(''))),
    )(indexRow) as [string, string][],
)

const getIndexedParsedNumericalRow = createSelector(
  [getParsedNumericalRow, getIndexRow],
  (row, indexRow) =>
    flow(
      zip(row),
      filter<[undefined | number, undefined | string]>(
        flow(nth(0), isUndefined, negate),
      ),
      map(map<undefined | string, string | number>(defaultTo(''))),
    )(indexRow) as [number, string][],
)

export const getRowIncorrects = createSelector(
  [getIndexedParsedCategoricalRow],
  filter<[string, string]>(flow(nth(0), Number, isNaN)),
)

export const getCleanNumericalRow = createSelector(
  [getIndexedParsedNumericalRow],
  filter<[number, string]>(flow(nth(0), Number, isNaN)),
)
