import { createSelector } from '@reduxjs/toolkit'
import { zip } from 'lodash'
import {
  getMatchColumns,
  getMatchVisits,
  getMatchesList,
  getColumnParam,
  getScoresList,
  getVisitParam,
  getPosParam,
  getVisits,
} from '@/app/selectors'
import { indexDuplicateSearcher } from '@/lib/array'
import fuse from '@/lib/fuse'
import { just } from '@/lib/monads'

export const getMatchVisit = createSelector(
  [getMatchVisits, getPosParam],
  (matchVisits, pos) => matchVisits[pos] ?? 0,
)

export const getMatchColumn = createSelector(
  [getMatchColumns, getPosParam],
  (matchColumns, pos) => matchColumns[pos] ?? '',
)

export const getMatches = createSelector(
  [getMatchesList, getPosParam],
  (matchesList, pos) => matchesList[pos] ?? [],
)

export const getScores = createSelector(
  [getScoresList, getPosParam],
  (scoresList, pos) => scoresList[pos] ?? [],
)

export const getVisit = createSelector(
  [getVisits, getMatchVisit],
  (visits, matchVisit) => visits[matchVisit] ?? '',
)

export const getColumnDuplicates = createSelector(
  [getMatchColumns, getMatchColumn],
  (matchColumns, matchColumn) =>
    indexDuplicateSearcher(
      matchColumns.map((match) => [match]),
      [matchColumn],
    ).map(([match]) => match),
)

export const getShouldFormat = createSelector(
  [getMatchVisit, getColumnDuplicates],
  (matchVisit, columnDuplicates) =>
    columnDuplicates.length > 1 || matchVisit !== 0,
)

export const getColumnPath = createSelector(
  [getMatchColumn, getShouldFormat, getVisit],
  (matchColumn, shouldFormat, visit) =>
    `/eda/${matchColumn.replace(/_/g, '-')}${shouldFormat ? `/${visit}` : ''}`,
)

export const getFormattedColumn = createSelector(
  [getMatchColumn, getShouldFormat, getVisit],
  (matchColumn, shouldFormat, visit) =>
    shouldFormat ? `${matchColumn}_${visit}` : matchColumn,
)

export const getIndices = createSelector(
  [getMatchColumns, getMatchVisits],
  (matchColumns, matchVisits) =>
    zip(matchColumns, matchVisits).map(
      ([matchColumn = '', matchVisit = 0]) =>
        [matchColumn, matchVisit] as const,
    ),
)

export const getSearchedPos = createSelector(
  [getIndices, getVisits, getColumnParam, getVisitParam],
  (indices, visits, column, visit) =>
    indices.findIndex(
      ([matchColumn, matchVisit]) =>
        column === matchColumn && visit === visits[matchVisit],
    ),
)

export const getMatchIndex = createSelector(
  [getMatches, getMatchColumn],
  (matches, matchColumn) => matches.indexOf(matchColumn),
)

const search = fuse.search.bind(fuse)

export const getScore = createSelector(
  [getMatchIndex, getMatchColumn, getScores],
  (matchIndex, matchColumn, scores) =>
    (
      1 -
      (scores[matchIndex] ??
        just(matchColumn)(search)(([match]) => match?.score ?? 1)())
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
  [getMatchesList, getScoresList, getMatchColumns],
  (matchesList, scoresList, matchColumns) =>
    (...args: [number, number]) =>
      args
        .map(
          (pos) =>
            scoresList[pos]?.[
              matchesList[pos]?.indexOf(matchColumns[pos] ?? '') ?? 0
            ] ?? 1,
        )
        .reduce((a, b) => a - b),
)
