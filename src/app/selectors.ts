import { stringLookup } from '@/lib/array'
import { getOrElse } from 'fp-ts/Option'
import { findIndex } from 'fp-ts/ReadonlyArray'
import { constant, pipe } from 'fp-ts/function'
import type { RootState } from './store'

// Params selectors
export const getPosParam = (_: RootState, pos: number) => pos

export const getColumnParam = (_: RootState, column: string) => column

export const getVisitParam = (_: RootState, _1: string, visit: string) => visit

export const getProgress = ({ progress }: RootState) => progress.progress

// Slice Selectors
export const getVisits = ({ sheet }: RootState) => sheet.visits

export const getColumns = ({ sheet }: RootState) => sheet.originalColumns

export const getData = ({ sheet }: RootState) => sheet.data

export const getMatchColumns = ({ columns }: RootState) => columns.matchColumns

export const getMatchVisits = ({ columns }: RootState) => columns.matchVisits

export const getScoresList = ({ columns }: RootState) => columns.scoresList

export const getMatchesList = ({ columns }: RootState) => columns.matchesList

export const searchPos = (
  indices: readonly (readonly [string, number])[],
  visits: readonly string[],
  searchColumn: string,
  searchVisit: string,
) =>
  pipe(
    indices,
    findIndex(
      ([matchColumn, matchVisit]) =>
        searchColumn === matchColumn &&
        searchVisit === stringLookup(visits)(matchVisit),
    ),
    getOrElse(constant(-1)),
  )
