import type { RootState } from '@/app/store'

import { createSelector } from '@reduxjs/toolkit'
import { transpose } from '@/lib/array'

// Selectors
const getMatchColumns = ({ columns }: RootState) => columns.matchColumns
const getMatchLists = ({ columns }: RootState) => columns.matchLists
const getMatchVisits = ({ columns }: RootState) => columns.matchVisits
const getVisits = ({ sheet }: RootState) => sheet.visits

export const getMatchColumn = (state: RootState, pos: number) =>
  getMatchColumns(state)[pos] ?? ''

const getMatchList = (state: RootState, pos: number) =>
  getMatchLists(state)[pos] ?? { matches: [], pos: -1 }

export const getMatchVisit = (state: RootState, pos: number) =>
  getMatchVisits(state)[pos] ?? 0

export const getIndices = createSelector(
  [getMatchColumns, getMatchVisits],
  (matchColumns, matchVisits) =>
    transpose([matchColumns, matchVisits] as const),
)

export const getIndexDuplicateSearcher = createSelector(
  [getIndices],
  (indices) => (filterIndex: [string, number]) =>
    indices.filter((index) =>
      transpose([index, filterIndex]).every(
        ([index, filter]) => index === filter,
      ),
    ),
)

export const getFormattedColumns = createSelector(
  [getIndices, getVisits],
  (indices, visits) =>
    indices.map(([indexColumn, indexVisit]) =>
      indices.filter(([checkColumn]) => indexColumn === checkColumn).length >
        1 || indexVisit !== 0
        ? `${indexColumn}_${visits[indexVisit]}`
        : indexColumn,
    ),
)

export const getMatchComparer = createSelector(
  [getMatchColumns],
  (matchColumns) =>
    (...args: [number, number]) => {
      const [a, b] = args.map((pos) => matchColumns[pos] ?? '') as [
        string,
        string,
      ]

      return a.localeCompare(b)
    },
)

export const getVisitsComparer = createSelector(
  [getMatchVisits],
  (matchVisits) =>
    (...args: [number, number]) =>
      args.map((pos) => matchVisits[pos] ?? 0).reduce((a, b) => a - b),
)

export const getMatchIndex = createSelector(
  [getMatchColumn, getMatchList],
  (matchColumn, matchList) =>
    matchList.matches.find(({ match }) => match === matchColumn),
)

export const getScoreComparer = createSelector(
  [getMatchLists, getMatchColumns],
  (matchLists, matchColumns) =>
    (...args: [number, number]) =>
      args
        .map(
          (pos) =>
            matchLists[pos]?.matches.find(
              ({ match }) => match === matchColumns[pos],
            )?.score ?? 1,
        )
        .reduce((a, b) => a - b),
)
