import { createSelector } from '@reduxjs/toolkit'
import { constant, identity, tupled, pipe } from 'fp-ts/function'
import * as RA from 'fp-ts/ReadonlyArray'
import * as O from 'fp-ts/Option'
import * as S from 'fp-ts/string'
import {
  getMatchColumns,
  getMatchVisits,
  getMatchesList,
  getColumnParam,
  getScoresList,
  getVisitParam,
  getPosParam,
  getVisits,
  searchPos,
} from '@/app/selectors'
import { indexDuplicateSearcher, numberLookup, stringLookup } from '@/lib/array'
import fuse from '@/lib/fuse'
import { strEquals } from '@/lib/string'

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
    RA.map(RA.head)(
      indexDuplicateSearcher(pipe(matchColumns, RA.of), [matchColumn]),
    ),
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
  (matchColumns, matchVisits) => RA.zip(matchVisits)(matchColumns),
)

export const getSearchedPos = createSelector(
  [getIndices, getVisits, getColumnParam, getVisitParam],
  (indices, visits, column, visit) => searchPos(indices, visits, column, visit),
)

export const getMatchIndex = createSelector(
  [getMatches, getMatchColumn],
  (matches, matchColumn) =>
    pipe(
      matches,
      pipe(matchColumn, strEquals, RA.findIndex),
      pipe(-1, constant, O.getOrElse),
    ),
)

const search = fuse.search.bind(fuse)

export const getScore = createSelector(
  [getMatchIndex, getMatchColumn, getScores],
  (matchIndex, matchColumn, scores) =>
    (
      1 -
      (scores[matchIndex] ??
        pipe(matchColumn, search, ([match]) => match?.score ?? 1))
    ).toFixed(2),
)

export const getMatchComparer = createSelector(
  [getMatchColumns],
  (matchColumns) => (a: number, b: number) => {
    return pipe(
      [a, b] as const,
      RA.map(stringLookup(matchColumns)),
      (x) => identity(x) as [string, string],
      tupled(S.Ord.compare),
    )
  },
)

export const getVisitsComparer = createSelector(
  [getMatchVisits],
  (matchVisits) => (a: number, b: number) =>
    pipe(
      [a, b] as const,
      RA.map(numberLookup(matchVisits)),
      RA.reduce(0, (acc, curr) => acc - curr),
    ),
)

export const getScoreComparer = createSelector(
  [getMatchesList, getScoresList, getMatchColumns],
  (matchesList, scoresList, matchColumns) => (a: number, b: number) =>
    pipe(
      [a, b] as const,
      RA.map((pos) =>
        pipe(
          scoresList,
          RA.zip(matchesList),
          RA.zip(matchColumns),
          RA.map(([[scores, matches], matchColumn]) =>
            pipe(
              scores,
              RA.lookup(
                pipe(
                  matches,
                  pipe(matchColumn, strEquals, RA.findIndex),
                  pipe(-1, constant, O.getOrElse),
                ),
              ),
              pipe(1, constant, O.getOrElse),
            ),
          ),
          RA.lookup(pos),
          pipe(1, constant, O.getOrElse),
        ),
      ),
      RA.reduce(0, (acc, curr) => acc - curr),
    ),
)
