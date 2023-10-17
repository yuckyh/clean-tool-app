import { createSelector } from '@reduxjs/toolkit'
import { constant, pipe } from 'fp-ts/function'
import {
  findIndex,
  lookup,
  reduce,
  head,
  zip,
  map,
  of,
} from 'fp-ts/ReadonlyArray'
import { getOrElse } from 'fp-ts/Option'
import Str from 'fp-ts/string'
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
import { indexDuplicateSearcher, numberLookup } from '@/lib/array'
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
    map(head)(indexDuplicateSearcher(pipe(matchColumns, of), [matchColumn])),
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
  (matchColumns, matchVisits) => pipe(matchColumns, zip(matchVisits)),
)

export const getSearchedPos = createSelector(
  [getIndices, getVisits, getColumnParam, getVisitParam],
  (indices, visits, column, visit) => searchPos(indices, visits, column, visit),
)

export const getMatchIndex = createSelector(
  [getMatches, getMatchColumn],
  (matches, matchColumn) =>
    pipe(matches, findIndex(strEquals(matchColumn)), getOrElse(constant(-1))),
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
  (matchColumns) =>
    (...args: readonly [number, number]) => {
      const [a, b] = pipe(
        args,
        map((pos) => pipe(matchColumns, lookup(pos), getOrElse(constant('')))),
      ) as readonly [string, string]

      return a.localeCompare(b)
    },
)

export const getVisitsComparer = createSelector(
  [getMatchVisits],
  (matchVisits) =>
    (...args: readonly [number, number]) =>
      pipe(
        args,
        map(numberLookup(matchVisits)),
        reduce(0, (acc, curr) => acc - curr),
      ),
)

export const getScoreComparer = createSelector(
  [getMatchesList, getScoresList, getMatchColumns],
  (matchesList, scoresList, matchColumns) =>
    (...args: readonly [number, number]) =>
      pipe(
        args,
        map((pos) =>
          pipe(
            scoresList,
            zip(matchesList),
            zip(matchColumns),
            map(([[scores, matches], matchColumn]) =>
              pipe(
                scores,
                lookup(
                  pipe(
                    matches,
                    findIndex((match) => Str.Eq.equals(matchColumn, match)),
                    getOrElse(constant(-1)),
                  ),
                ),
                getOrElse(constant(1)),
              ),
            ),
            lookup(pos),
            getOrElse(constant(1)),
          ),
        ),
        reduce(0, (acc, curr) => acc - curr),
      ),
)
