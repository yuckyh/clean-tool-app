import type { FlagReason } from '@/features/sheet/reducers'

import { stringLookup } from '@/lib/array'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'

import type { RootState } from './store'

// Params selectors
export const getColParam = (_state: RootState, col: number) => col

export const getRowParam = (_state: RootState, _col: number, row: number) => row

export const getColumnParam = (_state: RootState, column: string) => column

export const getVisitParam = (
  _state: RootState,
  _column: string,
  visit: string,
) => visit

export const getTitleParam = (_state: RootState, title: string) => title

export const getReasonParam = (
  _state: RootState,
  _1: string,
  reason: FlagReason,
) => reason

// Slice Selectors
export const getProgress = ({ progress }: RootState) => progress.progress

export const getSheetName = ({ sheet }: RootState) => sheet.sheetName

export const getVisits = ({ sheet }: RootState) => sheet.visits

export const getOriginalColumns = ({ sheet }: RootState) =>
  sheet.originalColumns

export const getData = ({ sheet }: RootState) => sheet.data

export const getFlaggedCells = ({ sheet }: RootState) => sheet.flaggedCells

export const getMatchColumns = ({ columns }: RootState) => columns.matchColumns

export const getMatchVisits = ({ columns }: RootState) => columns.matchVisits

export const getScoresList = ({ columns }: RootState) => columns.scoresList

export const getMatchesList = ({ columns }: RootState) => columns.matchesList

export const getDataTypes = ({ columns }: RootState) => columns.dataTypes

export const searchPos = (
  indices: readonly (readonly [string, number])[],
  visits: readonly string[],
  searchColumn: string,
  searchVisit: string,
) =>
  f.pipe(
    indices,
    RA.findIndex(
      ([matchColumn, matchVisit]) =>
        searchColumn === matchColumn &&
        searchVisit === stringLookup(visits)(matchVisit),
    ),
    O.getOrElse(f.constant(-1)),
  )
