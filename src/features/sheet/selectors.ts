import { createSelector } from '@reduxjs/toolkit'

import { identity, tupled, flow, pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as S from 'fp-ts/string'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as Eq from 'fp-ts/Eq'
import * as RS from 'fp-ts/ReadonlySet'
import * as N from 'fp-ts/number'
import {
  getFlaggedCells,
  getReasonParam,
  getTitleParam,
  getPosParam,
  getColumns,
  searchPos,
  getVisits,
  getData,
} from '@/app/selectors'
import { getIndexedValue, stringLookup } from '@/lib/array'
import * as P from 'fp-ts/Predicate'
import { getSearchedPos, getIndices } from '../columns/selectors'
import type { Flag } from './reducers'

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
      pipe(columns, stringLookup, RA.map),
      (x) => identity(x) as [string, string],
      tupled(S.Ord.compare),
    )
  },
)

const getIndexRow = createSelector(
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
          O.getOrElse(() => '' as Property<CellItem>),
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
          O.getOrElse(() => '' as Property<CellItem>),
          (x) => x.toString(),
        ),
      ),
    ),
)

export const getIndexedRow = createSelector(
  [getRow, getIndexRow],
  (row, indexRow) => RA.zip(row)(indexRow),
)

export const getRowBlanks = createSelector(
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
  [getRow],
  RA.filter((cell) =>
    pipe(
      ['', 'na', 'none', 'blank'] as const,
      RA.every(
        (marker) => marker !== pipe(cell, S.replace('/', ''), S.toLowerCase),
      ),
    ),
  ),
)

export const getIndexedRowIncorrects = createSelector(
  [getBlanklessRow, getIndexRow],
  (row, indexRow) =>
    pipe(
      row,
      RA.filter((val) => /[!,.?]{2,}/.test(val)),
      (filteredRow) => RA.zip(filteredRow)(indexRow),
    ),
)

const getNumericalRow = createSelector(
  [getBlanklessRow],
  flow(
    RA.filter((val) => !/[!,.?]{2,}/.test(val)),
    RA.map(parseFloat),
  ),
)

const getIndexedNumericalRow = createSelector(
  [getNumericalRow, getIndexRow],
  (row, indexRow) => RA.zip(row)(indexRow),
)

export const getCleanNumericalRow = createSelector(
  [getIndexedNumericalRow],
  RA.filter(flow(getIndexedValue, P.not(Number.isNaN))),
)

export const FlagEq: Eq.Eq<Flag> = Eq.tuple(S.Eq, S.Eq, N.Eq, S.Eq)

export const getFlaggedRows = createSelector(
  [getFlaggedCells, getTitleParam],
  (flaggedCells, title) =>
    pipe(
      flaggedCells,
      RA.filter(([, flagTitle]) => flagTitle === title),
      RS.fromReadonlyArray(FlagEq),
      RS.map(N.Eq)(([, , index]) => index),
    ),
)

export const getFilteredFlaggedRows = createSelector(
  [getFlaggedCells, getTitleParam, getReasonParam],
  (flaggedCells, title, reason) =>
    pipe(
      flaggedCells,
      RA.filter(
        ([, flagTitle, , flagReason]) =>
          flagTitle === title && flagReason === reason,
      ),
      RS.fromReadonlyArray(FlagEq),
      RS.map(N.Eq)(([, , index]) => index),
    ),
)
