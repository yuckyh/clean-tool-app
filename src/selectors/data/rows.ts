/**
 * @file The file contains the selectors for the row in the data slice.
 * @module selectors/data/rows
 */

import { getReasonParam, getTitleParam } from '@/app/selectors'
import { arrayLookup, getIndexedValue, recordLookup } from '@/lib/array'
import { equals, isCorrectNumber } from '@/lib/fp'
import * as CellItem from '@/lib/fp/CellItem'
import { refinedEq, stubEq } from '@/lib/fp/Eq'
import * as Flag from '@/lib/fp/Flag'
import { dump } from '@/lib/fp/logger'
import { getIndexColumnPos, getSearchedPos } from '@/selectors/matches/pos'
import { createSelector } from '@reduxjs/toolkit'
import * as Eq from 'fp-ts/Eq'
import * as P from 'fp-ts/Predicate'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RS from 'fp-ts/ReadonlySet'
import * as f from 'fp-ts/function'
import * as N from 'fp-ts/number'
import * as S from 'fp-ts/string'

import { getData } from '.'
import { getFlaggedCells } from './cells'
import { getOriginalColumns } from './columns'

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
 * Function to check whether the given string is correctly formatted as a number.
 * @param str - The string to check
 * @returns Whether the given string is correctly formatted as a number
 * @example
 *  isNumString('1') // true
 *  isNumString('1.0') // true
 *  isNumString('1.0.0') // false
 */
const isNumString = (str: string) => /[!,.?]{2,}/.test(str)

const rowByColumnPos = (
  data: readonly CellItem.CellItem[],
  originalColumns: readonly string[],
  pos: number,
) =>
  RA.map(
    f.flow(
      CellItem.fold(
        f.flow(
          recordLookup<string, CellItem.Value>,
          f.apply(''),
          f.apply(arrayLookup(originalColumns)('')(pos)),
        ),
      ),
      (x) => x.toString(),
    ),
  )(data)

export const getIndexRow = createSelector(
  [getData, getOriginalColumns, getIndexColumnPos],
  rowByColumnPos,
)

/**
 *
 */
export const getRow = createSelector(
  [getData, getOriginalColumns, getSearchedPos],
  rowByColumnPos,
)

/**
 *
 */
export const getIndexedRow = createSelector(
  [getIndexRow, getRow],
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
 */
export const getIndexedRowIncorrects = createSelector(
  [getBlanklessRow],
  RA.filter(f.flow(getIndexedValue, isNumString)),
)

/**
 *
 */
export const getIndexedNumericalRow = createSelector(
  [getBlanklessRow],
  f.flow(
    RA.filter(f.flow(getIndexedValue, isCorrectNumber)),
    RA.map(([index, val]) => [index, parseFloat(val)] as const),
  ),
)

/**
 *
 */
export const getSortedNumericalRow = createSelector(
  [getIndexedNumericalRow],
  f.flow(RA.map(getIndexedValue), RA.sort(N.Ord)),
)

/**
 *
 */
export const getFlaggedRows = createSelector(
  [getFlaggedCells, getTitleParam, getReasonParam],
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
