import { createSelector } from '@reduxjs/toolkit'

import { map, zip } from 'fp-ts/ReadonlyNonEmptyArray'
import { constant, pipe } from 'fp-ts/function'
import { getOrElse } from 'fp-ts/EitherT'
import { fromNullable } from 'fp-ts/Option'
import { getSearchedPos, getIndices } from '../columns/selectors'
import { getPosParam, getColumns, getData } from '@/app/selectors'

export const getColumnsLength = createSelector(
  [getColumns],
  (columns) => columns.length,
)

function localeCompare(acc: number | string, prev: string) {
  return typeof acc === 'string' ? acc.localeCompare(prev) : prev
}

export const getColumnComparer = createSelector(
  [getColumns],
  (columns) =>
    (...args: [number, number]) =>
      args.map((pos) => columns[pos] ?? '').reduce(localeCompare, 0),
)

export const getColumn = createSelector(
  [getColumns, getPosParam],
  (columns, pos) => columns[pos] ?? '',
)

const getIndexRow = createSelector(
  [getData, getColumns, getIndices],
  (data, columns, indices) =>
    data.map(
      (row) =>
        `${
          row[
            columns[
              indices.findIndex(
                ([matchColumn, matchVisit]: readonly [string, number]) =>
                  matchColumn === 'sno' && matchVisit === 0,
              )
            ]
          ] ?? ''
        }`,
    ),
)

export const getRow = createSelector(
  [getData, getColumns, getSearchedPos],
  (data, columns, pos) => map((row) => `${row[columns[pos] ?? '']}`)(data),
)

export const getIndexedRow = createSelector(
  [getRow, getIndexRow],
  (row, indexRow) =>
    pipe(indexRow, zip(row), map(map(fromNullable(getOrElse(constant('')))))),
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
    every(
      flow<
        [string],
        string,
        string,
        (arg: string) => boolean,
        (arg: string) => boolean
      >(
        replace('/')(''),
        toLower,
        isEqual,
        negate,
      )(value),
    )(['', 'na', 'none', 'blank']),
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
  (row) => row.filter(([value]) => isNaN(Number(value))),
)

export const getCleanNumericalRow = createSelector(
  [getIndexedParsedNumericalRow],
  (row) => row.filter(([value]) => !isNaN(value)),
)
