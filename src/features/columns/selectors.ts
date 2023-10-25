import {
  getColumnParam,
  getDataTypes,
  getMatchColumns,
  getMatchVisits,
  getMatchesList,
  getPosParam,
  getScoresList,
  getVisitParam,
  getVisits,
  searchPos,
} from '@/app/selectors'
import { indexDuplicateSearcher, numberLookup, stringLookup } from '@/lib/array'
import { strEquals } from '@/lib/fp'
import fuse from '@/lib/fuse'
import { createSelector } from '@reduxjs/toolkit'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'
import * as S from 'fp-ts/string'

const search = fuse.search.bind(fuse)

export const getMatchVisit = createSelector(
  [getMatchVisits, getPosParam],
  (matchVisits, pos) => numberLookup(matchVisits)(pos),
)

export const getMatchColumn = createSelector(
  [getMatchColumns, getPosParam],
  (matchColumns, pos) => stringLookup(matchColumns)(pos),
)

export const getMatches = createSelector(
  [getMatchesList, getPosParam],
  (matchesList, pos) => matchesList[pos] ?? [],
)

export const getScores = createSelector(
  [getScoresList, getPosParam],
  (scoresList, pos) => scoresList[pos] ?? [],
)

export const getVisitByMatchVisit = createSelector(
  [getVisits, getMatchVisit],
  (visits, matchVisit) => stringLookup(visits)(matchVisit),
)

export const getColumnDuplicates = createSelector(
  [getMatchColumns, getMatchColumn],
  (matchColumns, matchColumn) =>
    indexDuplicateSearcher(f.pipe(matchColumns, RA.map(RA.of)), [matchColumn]),
)

export const getColumnDuplicatesList = createSelector(
  [getMatchColumns],
  (matchColumns) =>
    f.pipe(
      matchColumns,
      RA.map((matchColumn) =>
        indexDuplicateSearcher(f.pipe(matchColumns, RA.map(RA.of)), [
          matchColumn,
        ]),
      ),
    ),
)

export const getShouldFormat = createSelector(
  [getMatchVisit, getColumnDuplicates],
  (matchVisit, columnDuplicates) =>
    columnDuplicates.length > 1 || matchVisit !== 0,
)

const getShouldFormatList = createSelector(
  [getMatchVisits, getColumnDuplicatesList],
  (matchVisits, columnDuplicatesList) =>
    f.pipe(
      matchVisits,
      RA.zip(columnDuplicatesList),
      RA.map(
        ([matchVisit, columnDuplicates]) =>
          columnDuplicates.length > 1 || matchVisit !== 0,
      ),
    ),
)

export const getColumnPath = createSelector(
  [getMatchColumn, getShouldFormat, getVisitByMatchVisit],
  (matchColumn, shouldFormat, visit) =>
    `/eda/${matchColumn.replace(/_/g, '-')}${shouldFormat ? `/${visit}` : ''}`,
)

export const getFormattedColumn = createSelector(
  [getMatchColumn, getShouldFormat, getVisitByMatchVisit],
  (matchColumn, shouldFormat, visit) =>
    shouldFormat ? `${matchColumn}_${visit}` : matchColumn,
)

export const getFormattedColumns = createSelector(
  [getMatchColumns, getShouldFormatList, getVisits, getMatchVisits],
  (matchColumns, shouldFormatList, visits, matchVisits) =>
    f.pipe(
      matchColumns,
      RA.zip(shouldFormatList),
      RA.zip(matchVisits),
      RA.map(([[matchColumn, shouldFormat], matchVisit]) =>
        shouldFormat
          ? `${matchColumn}_${stringLookup(visits)(matchVisit)}`
          : matchColumn,
      ),
    ),
)

export const getIndices = createSelector(
  [getMatchColumns, getMatchVisits],
  (matchColumns, matchVisits) => RA.zip(matchVisits)(matchColumns),
)

export const getSearchedPos = createSelector(
  [getIndices, getVisits, getColumnParam, getVisitParam],
  (indices, visits, column, visit) => searchPos(indices, visits, column, visit),
)

export const getMatchIndex = createSelector(
  [getMatches, getMatchColumn],
  (matches, matchColumn) =>
    f.pipe(
      matches,
      f.pipe(matchColumn, strEquals, RA.findIndex),
      f.pipe(-1, f.constant, O.getOrElse),
    ),
)

export const getDataType = createSelector(
  [getDataTypes, getSearchedPos],
  (dataTypes, pos) => stringLookup(dataTypes)(pos),
)

export const getScore = createSelector(
  [getMatchIndex, getMatchColumn, getScores],
  (matchIndex, matchColumn, scores) =>
    (
      1 -
      (scores[matchIndex] ??
        f.pipe(matchColumn, search, ([match]) => match?.score ?? 1))
    ).toFixed(2),
)

export const getMatchComparer = createSelector(
  [getMatchColumns],
  (matchColumns) => (a: number, b: number) => {
    return f.pipe(
      [a, b] as const,
      RA.map(stringLookup(matchColumns)),
      (x) => f.identity(x) as [string, string],
      f.tupled(S.Ord.compare),
    )
  },
)

export const getVisitsComparer = createSelector(
  [getMatchVisits],
  (matchVisits) => (a: number, b: number) =>
    f.pipe(
      [a, b] as const,
      RA.map(numberLookup(matchVisits)),
      RA.reduce(0, (acc, curr) => acc - curr),
    ),
)

export const getScoreComparer = createSelector(
  [getMatchesList, getScoresList, getMatchColumns],
  (matchesList, scoresList, matchColumns) => (a: number, b: number) =>
    f.pipe(
      [a, b] as const,
      RA.map((pos) =>
        f.pipe(
          scoresList,
          RA.zip(matchesList),
          RA.zip(matchColumns),
          RA.map(([[scores, matches], matchColumn]) =>
            f.pipe(
              scores,
              RA.lookup(
                f.pipe(
                  matches,
                  f.pipe(matchColumn, strEquals, RA.findIndex),
                  f.pipe(-1, f.constant, O.getOrElse),
                ),
              ),
              f.pipe(1, f.constant, O.getOrElse),
            ),
          ),
          RA.lookup(pos),
          f.pipe(1, f.constant, O.getOrElse),
        ),
      ),
      RA.reduce(0, (acc, curr) => acc - curr),
    ),
)
