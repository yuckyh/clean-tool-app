import type { RootState } from '@/app/store'

import { indexDuplicateSearcher } from '@/lib/array'
import { createSelector } from '@reduxjs/toolkit'
import fuse from '@/lib/fuse'
import _ from 'lodash'

// Selectors
const getMatchColumns = ({ columns }: RootState) => columns.matchColumns
const getMatchLists = ({ columns }: RootState) => columns.matchLists
const getMatchVisits = ({ columns }: RootState) => columns.matchVisits
const getVisits = ({ sheet }: RootState) => sheet.visits

export const getIndices = createSelector(
  [getMatchColumns, getMatchVisits],
  (matchColumns, matchVisits) => _.zip(matchColumns, matchVisits),
)

export const getMatchColumn = (state: RootState, pos: number) =>
  getMatchColumns(state)[pos] ?? ''

const getMatchList = (state: RootState, pos: number) =>
  getMatchLists(state)[pos] ?? { matches: [], pos: -1 }

export const getMatchVisit = (state: RootState, pos: number) =>
  getMatchVisits(state)[pos] ?? 0

export const getColumnDuplicates = createSelector(
  [getMatchColumns, getMatchColumn],
  (matchColumns, matchColumn) =>
    indexDuplicateSearcher(
      matchColumns.map((match) => [match] as const),
      [matchColumn],
    ).map(([match]) => match),
)

export const getShouldFormat = createSelector(
  [getMatchVisit, getColumnDuplicates],
  (matchVisit, columnDuplicates) =>
    columnDuplicates.length > 1 || matchVisit !== 0,
)

export const getColumnsPath = createSelector(
  [getMatchColumn, getMatchVisit, getShouldFormat, getVisits],
  (matchColumn, matchVisit, shouldFormat, visits) =>
    shouldFormat
      ? `/eda/${matchColumn.replace(/_/g, '-')}/${visits[matchVisit]}`
      : `/eda/${matchColumn.replace(/_/g, '-')}`,
)

export const getFormattedColumn = createSelector(
  [getMatchColumn, getMatchVisit, getShouldFormat, getVisits],
  (matchColumn, matchVisit, shouldFormat, visits) =>
    shouldFormat ? `${matchColumn}_${visits[matchVisit]}` : matchColumn,
)

export const getMatchIndex = createSelector(
  [getMatchColumn, getMatchList],
  (matchColumn, matchList) =>
    matchList.matches.find(({ match }) => match === matchColumn),
)

export const getScore = createSelector(
  [getMatchIndex, getMatchColumn],
  (matchIndex, matchColumn) =>
    (
      1 - (matchIndex?.score ?? fuse.search(matchColumn)[0]?.score ?? 1)
    ).toFixed(2),
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
