import { createSelector } from '@reduxjs/toolkit'

import { pipe } from 'fp-ts/function'
import { getOrElse } from 'fp-ts/Option'
import { filter, every, some, map, zip } from 'fp-ts/ReadonlyArray'
import Str from 'fp-ts/string'
import RR from 'fp-ts/ReadonlyRecord'
import {
  getPosParam,
  getColumns,
  searchPos,
  getVisits,
  getData,
} from '@/app/selectors'
import { stringLookup } from '@/lib/array'
import { getSearchedPos, getIndices } from '../columns/selectors'

export const getColumnsLength = createSelector(
  [getColumns],
  (columns) => columns.length,
)

export const getColumnComparer = createSelector(
  [getColumns],
  (columns) =>
    (...args: readonly [number, number]) => {
      const [a, b] = pipe(args, map(stringLookup(columns))) as readonly [
        string,
        string,
      ]

      return a.localeCompare(b)
    },
)

export const getColumn = createSelector(
  [getColumns, getPosParam],
  (columns, pos) => stringLookup(columns)(pos),
)

const getIndexRow = createSelector(
  [getData, getColumns, getIndices, getVisits],
  (data, columns, indices, visits) =>
    pipe(
      data,
      map((row) =>
        pipe(
          row,
          RR.lookup(
            stringLookup(columns)(
              searchPos(indices, visits, 'sno', stringLookup(visits)(0)),
            ),
          ),
          getOrElse(() => '' as Property<CellItem>),
          toString,
        ),
      ),
    ),
)

export const getRow = createSelector(
  [getData, getColumns, getSearchedPos],
  (data, columns, pos) =>
    pipe(
      data,
      map((row) =>
        pipe(
          row,
          RR.lookup(stringLookup(columns)(pos)),
          getOrElse(() => '' as Property<CellItem>),
          toString,
        ),
      ),
    ),
)

export const getIndexedRow = createSelector(
  [getRow, getIndexRow],
  (row, indexRow) => zip(indexRow)(row),
)

const getRowBlanks = createSelector(
  [getRow],
  filter((cell) =>
    pipe(
      ['', 'na', 'none', 'blank'] as const,
      some(
        (marker) =>
          marker === pipe(cell, Str.replace('/', ''), Str.toLowerCase),
      ),
    ),
  ),
)

export const getIndexedRowBlanks = createSelector(
  [getRowBlanks, getIndexRow],
  (row, indexRow) => zip(indexRow)(row),
)

const getBlanklessRow = createSelector(
  [getRow],
  filter((cell) =>
    pipe(
      ['', 'na', 'none', 'blank'] as const,
      every(
        (marker) =>
          marker !== pipe(cell, Str.replace('/', ''), Str.toLowerCase),
      ),
    ),
  ),
)

const getNumericalRow = createSelector(
  [getBlanklessRow],
  map((cell) => pipe(cell, Str.replace(/[!,.?]+/, '.'), parseFloat)),
)

const getIndexedCategoricalRow = createSelector(
  [getBlanklessRow, getIndexRow],
  (row, indexRow) => pipe(indexRow, zip(row)),
)

const getIndexedNumericalRow = createSelector(
  [getNumericalRow, getIndexRow],
  (row, indexRow) => pipe(indexRow, zip(row)),
)

export const getRowIncorrects = createSelector(
  [getIndexedCategoricalRow],
  (row) => row.filter(([, value]) => Number.isNaN(Number(value))),
)

export const getCleanNumericalRow = createSelector(
  [getIndexedNumericalRow],
  (row) =>
    pipe(
      row,
      filter(([, value]) => !Number.isNaN(value)),
    ),
)
