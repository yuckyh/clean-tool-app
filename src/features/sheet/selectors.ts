import { createSelector } from '@reduxjs/toolkit'

import { tupled, flow, hole, pipe } from 'fp-ts/function'
import { getOrElse } from 'fp-ts/Option'
import { filter, every, some, map, zip } from 'fp-ts/ReadonlyArray'
import Str, { Ord } from 'fp-ts/string'
import RR from 'fp-ts/ReadonlyRecord'
import {
  getPosParam,
  getColumns,
  searchPos,
  getVisits,
  getData,
} from '@/app/selectors'
import { stringLookup } from '@/lib/array'
import { not } from 'fp-ts/Predicate'
import { getSearchedPos, getIndices } from '../columns/selectors'

export const getColumnsLength = createSelector(
  [getColumns],
  (columns) => columns.length,
)

export const getColumn = createSelector(
  [getColumns, getPosParam],
  (columns, pos) => stringLookup(columns)(pos),
)

export const getColumnComparer = createSelector(
  [getColumns],
  (columns) => (posA: number, posB: number) => {
    return pipe(
      [posA, posB] as const,
      map(stringLookup(columns)),
      hole<[string, string]>,
      tupled(Ord.compare),
    )
  },
)

const getIndexRow = createSelector(
  [getData, getColumns, getIndices, getVisits],
  (data, columns, indices, visits) =>
    pipe(
      data,
      map(
        flow(
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
      map(
        flow(
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
  map(flow(Str.replace(/[!,.?]+/, '.'), parseFloat)),
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
  filter(([, value]) => Number.isNaN(value)),
)

export const getCleanNumericalRow = createSelector(
  [getIndexedNumericalRow],
  filter(not(([, value]) => Number.isNaN(value))),
)
