/**
 * @file This file is for the columns data grid component.
 * @module pages/ColumnMatching/ColumnsDataGrid
 */

import type { AlertRef } from '@/components/AlertDialog'
import type { Props as SimpleDataGridProps } from '@/components/SimpleDataGrid'
import type {
  DataGridFocusMode,
  DataGridProps,
  TableColumnDefinition,
} from '@fluentui/react-components'
import type { RefObject } from 'react'

import { getMatchVisits, getVisits } from '@/app/selectors'
import Loader from '@/components/Loader'
import SimpleDataGrid from '@/components/SimpleDataGrid'
import { fetchMatches } from '@/features/columns/actions'
import {
  getMatchComparer,
  getScoreComparer,
  getVisitsComparer,
} from '@/features/columns/selectors'
import { fetchSheet } from '@/features/sheet/actions'
import { equals, length } from '@/lib/fp'
import { dumpError } from '@/lib/fp/logger'
import {
  useAppDispatch,
  useAppSelector,
  useLoadingTransition,
} from '@/lib/hooks'
import { createLazyMemo, createMemo } from '@/lib/utils'
import {
  getColumnComparer,
  getColumnsLength,
} from '@/selectors/columns/selectors'
import {
  Spinner,
  Subtitle1,
  createTableColumn,
} from '@fluentui/react-components'
import * as IO from 'fp-ts/IO'
import * as RA from 'fp-ts/ReadonlyArray'
import * as T from 'fp-ts/Task'
import * as TO from 'fp-ts/TaskOption'
import * as f from 'fp-ts/function'
import * as N from 'fp-ts/number'
import { useCallback, useEffect, useMemo, useState } from 'react'

import HeaderCell from './HeaderCell'
import ValueCell from './ValueCell'

const MemoizedMatchCell = createLazyMemo(
  'MemoizedMatchCell',
  import('@/features/columns/components/MatchCell'),
)
const MemoizedScoreCell = createLazyMemo(
  'MemoizedScoreCell',
  import('@/features/columns/components/ScoreCell'),
)
const MemoizedVisitsCell = createLazyMemo(
  'MemoizedVisitsCell',
  import('@/features/columns/components/VisitsCell'),
)
const MemoizedDataGrid = createMemo<SimpleDataGridProps<number>>(
  'MemoizedDataGrid',
  SimpleDataGrid,
)

const focusMode: DataGridFocusMode = 'composite'

/**
 * The props for {@link ColumnsDataGrid}.
 */
interface Props {
  /**
   * The alert ref for the error alert used by the {@link pages/ColumnMatching ColumnMatching} page.
   */
  errorAlertRef: RefObject<AlertRef>
  /**
   * The alert ref for the info alert used by the {@link pages/ColumnMatching ColumnMatching} page.
   */
  infoAlertRef: RefObject<AlertRef>
}

/**
 * This data grid provides the special column matching functionality.
 * It consists of 4 columns:
 * 1. The original column names
 * 2. The possible replacements
 * 3. The matching visit number
 * 4. The fuzzy search score
 * @category Component
 * @param props - The props {@link Props}
 * @param props.errorAlertRef - The alert ref for the error alert used by the {@link pages/ColumnMatching ColumnMatching} page.
 * @param props.infoAlertRef - The alert ref for the info alert used by the {@link pages/ColumnMatching ColumnMatching} page.
 * @returns A data grid for the user to match columns
 * @example
 * ```ts
 * <ColumnsDataGrid errorAlertRef={errorAlertRef} infoAlertRef={infoAlertRef} />
 * ```
 */
export default function ColumnsDataGrid({
  errorAlertRef,
  infoAlertRef,
}: Readonly<Props>) {
  const dispatch = useAppDispatch()

  const columnsLength = useAppSelector(getColumnsLength)
  const matchVisits = useAppSelector(getMatchVisits)
  const visits = useAppSelector(getVisits)
  const columnComparer = useAppSelector(getColumnComparer)
  const matchComparer = useAppSelector(getMatchComparer)
  const visitsComparer = useAppSelector(getVisitsComparer)
  const scoreComparer = useAppSelector(getScoreComparer)

  const [isLoading, stopLoading] = useLoadingTransition()

  const [sortState, setSortState] = useState<
    Parameters<NonNullable<DataGridProps['onSortChange']>>[1]
  >({ sortColumn: '', sortDirection: 'ascending' })

  const handleSortChange: Required<DataGridProps>['onSortChange'] = useCallback(
    (_event, nextSortState) => {
      setSortState(nextSortState)
    },
    [],
  )

  const items = useMemo(
    () => RA.makeBy(columnsLength, f.identity),
    [columnsLength],
  )

  const columnsDefinition: readonly TableColumnDefinition<number>[] =
    useMemo(() => {
      const initial = [
        createTableColumn({
          columnId: 'original',
          compare: columnComparer,
          renderCell: (pos) => <ValueCell pos={pos} />,
          renderHeaderCell: f.constant(
            <HeaderCell
              header="Original"
              subtitle="The loaded column names (raw)"
            />,
          ),
        }),
        createTableColumn({
          columnId: 'matches',
          compare: matchComparer,
          renderCell: (pos) => (
            <MemoizedMatchCell alertRef={errorAlertRef} pos={pos} />
          ),
          renderHeaderCell: f.constant(
            <HeaderCell
              header="Replacement"
              subtitle="List of possible replacements (sorted by score)"
            />,
          ),
        }),
      ]
      const withVisits =
        visits.length > 1
          ? [
              ...initial,
              createTableColumn({
                columnId: 'visit',
                compare: visitsComparer,
                renderCell: (pos) => (
                  <MemoizedVisitsCell alertRef={errorAlertRef} pos={pos} />
                ),
                renderHeaderCell: f.constant(
                  <HeaderCell
                    header="Visit"
                    subtitle="The matching visit number"
                  />,
                ),
              }),
            ]
          : initial

      return [
        ...withVisits,
        createTableColumn({
          columnId: 'score',
          compare: scoreComparer,
          renderCell: (pos) => <MemoizedScoreCell pos={pos} />,
          renderHeaderCell: f.constant(
            <HeaderCell
              header="Score"
              subtitle="The fuzzy search score (1 indicates a perfect match)"
            />,
          ),
        }),
      ]
    }, [
      columnComparer,
      matchComparer,
      visits.length,
      visitsComparer,
      scoreComparer,
      errorAlertRef,
    ])

  useEffect(() => {
    f.pipe(
      matchVisits,
      length,
      TO.fromPredicate(equals(N.Eq)(0)),
      TO.map(f.flow(fetchSheet, (x) => dispatch(x))),
      TO.match(fetchMatches, fetchMatches),
      T.map((x) => dispatch(x)),
      IO.tap(() =>
        Math.max(...matchVisits) > visits.length && visits.length > 0
          ? infoAlertRef.current?.open ?? IO.Do
          : IO.Do,
      ),
      IO.tap(() => stopLoading),
    )().catch(dumpError)
    return undefined
  }, [
    dispatch,
    columnsLength,
    stopLoading,
    matchVisits,
    visits.length,
    infoAlertRef,
  ])

  return !isLoading ? (
    <Loader
      label={<Subtitle1>Matching columns...</Subtitle1>}
      labelPosition="below"
      size="huge">
      <MemoizedDataGrid
        columns={columnsDefinition}
        focusMode={focusMode}
        items={items}
        onSortChange={handleSortChange}
        sortState={sortState}
        sortable
      />
    </Loader>
  ) : (
    <Spinner
      label={<Subtitle1>Matching columns...</Subtitle1>}
      labelPosition="below"
      size="huge"
    />
  )
}
