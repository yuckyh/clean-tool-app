import { createSelector } from '@reduxjs/toolkit'
import { pipe } from 'fp-ts/function'
import { flatten, reduce, map, zip } from 'fp-ts/ReadonlyNonEmptyArray'
import { findIndex } from 'fp-ts/ReadonlyArray'
import { getOrElse } from 'fp-ts/Option'
import * as Str from 'fp-ts/string'
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
    map(nth(0))(
      indexDuplicateSearcher(map((match) => [match])(matchColumns), [
        matchColumn,
      ]),
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
    `/eda/${kebabCase(matchColumn)}${shouldFormat ? `/${visit}` : ''}`,
)

export const getFormattedColumn = createSelector(
  [getMatchColumn, getShouldFormat, getVisit],
  (matchColumn, shouldFormat, visit) =>
    shouldFormat ? `${matchColumn}_${visit}` : matchColumn,
)

export const getIndices = createSelector(
  [getMatchColumns, getMatchVisits],
  (matchColumns, matchVisits) =>
    flow(
      zip(matchColumns),
      map(
        ([matchColumn = '', matchVisit = 0]) =>
          [matchColumn, matchVisit] as const,
      ),
    )(matchVisits),
)

export const getSearchedPos = createSelector(
  [getIndices, getVisits, getColumnParam, getVisitParam],
  (indices, visits, column, visit) =>
    findIndex<readonly [string, number]>(
      ([matchColumn, matchVisit]) =>
        column === matchColumn && visit === visits[matchVisit],
    )(indices),
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
      const [a, b] = map<number, string>((pos) => matchColumns[pos] ?? '')(
        args,
      ) as [string, string]

      return a.localeCompare(b)
    },
)

export const getVisitsComparer = createSelector(
  [getMatchVisits],
  (matchVisits) =>
    ([a, b]: readonly [number, number]) =>
      pipe(
        [a, b] as const,
        map((pos) => matchVisits[pos] ?? 0),
        reduce(0, (acc, curr) => acc - curr),
      ),
)

export const getScoreComparer = createSelector(
  [getMatchesList, getScoresList, getMatchColumns],
  (matchesList, scoresList, matchColumns) =>
    ([a, b]: readonly [number, number]) =>
      pipe(
        [a, b] as const,
        map((pos) =>
          pipe(
            scoresList,
            zip(matchesList),
            flatten,
            zip(matchColumns),
            flatten,
            map(
              ([scores = [], matches = [], matchColumn = '']) =>
                scores[
                  pipe(
                    matches,
                    findIndex((match) => Str.Eq(matchColumn, match)),
                    getOrElse(constant(-1)),
                  )
                ],
            ),
            nth(pos),
            defaultTo(0),
          ),
        ),
        reduce(0, (acc, curr) => acc - curr),
      ),
)
