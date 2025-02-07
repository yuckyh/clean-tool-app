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

import { fetchMatches } from '@/actions/matches'
import Loader from '@/components/Loader'
import SimpleDataGrid from '@/components/SimpleDataGrid'
import { dumpError } from '@/lib/fp/logger'
import { add } from '@/lib/fp/number'
import {
  useAppDispatch,
  useAppSelector,
  useLoadingTransition,
} from '@/lib/hooks'
import { createLazyMemo, createMemo } from '@/lib/utils'
import { syncVisits } from '@/reducers/data'
import { getColumnComparer, getColumnsLength } from '@/selectors/data/columns'
import { getVisitsLength } from '@/selectors/data/visits'
import { getMatchColumnsComparer } from '@/selectors/matches/columns'
import { getScoreComparer } from '@/selectors/matches/scores'
import { getMatchVisits, getVisitsComparer } from '@/selectors/matches/visits'
import {
  Spinner,
  Subtitle1,
  createTableColumn,
} from '@fluentui/react-components'
import * as IO from 'fp-ts/IO'
import * as IOO from 'fp-ts/IOOption'
import * as RA from 'fp-ts/ReadonlyArray'
import * as T from 'fp-ts/Task'
import * as f from 'fp-ts/function'
import { useCallback, useEffect, useMemo, useState } from 'react'

import HeaderCell from './HeaderCell'
import ValueCell from './ValueCell'

const MemoizedMatchCell = createLazyMemo(
  'MemoizedMatchCell',
  import('@/components/matches/MatchCell'),
)
const MemoizedScoreCell = createLazyMemo(
  'MemoizedScoreCell',
  import('@/components/matches/ScoreCell'),
)
const MemoizedVisitsCell = createLazyMemo(
  'MemoizedVisitsCell',
  import('@/components/matches/VisitsCell'),
)
const MemoizedDataGrid = createMemo<SimpleDataGridProps<number>>(
  'MemoizedDataGrid',
  SimpleDataGrid,
)

const focusMode: DataGridFocusMode = 'composite'

/**
 * The hook for fetching the matches.
 * @param stopLoading - The function to stop the loading transition.
 * @example
 * ```tsx
 *    useFetchMatches()
 * ```
 */
const useFetchMatches = (stopLoading: IO.IO<void>) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    f.pipe(
      fetchMatches,
      (x) => dispatch(x()),
      T.of,
      T.tapIO(() => stopLoading),
    )().catch(dumpError)
  }, [dispatch, stopLoading])
}

const useInferVisitAlert = (infoAlertRef: RefObject<AlertRef>) => {
  const dispatch = useAppDispatch()
  const matchVisits = useAppSelector(getMatchVisits)
  const visitsLength = useAppSelector(getVisitsLength)

  useEffect(() => {
    f.pipe(
      visitsLength,
      IOO.fromPredicate((x) => Math.max(...matchVisits) >= x && x > 0),
      IOO.map(
        f.flow(
          () => matchVisits as number[],
          f.tupled(Math.max),
          add(1),
          syncVisits,
          dispatch,
        ),
      ),
      IOO.flatMapIO(() => infoAlertRef.current?.open ?? IO.of(() => {})),
    )()
  }, [dispatch, infoAlertRef, matchVisits, visitsLength])
}

/**
 * The props for {@link MatchesDataGrid}.
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
 * @param props - The {@link Props props} for the component.
 * @param props.errorAlertRef - The alert ref for the error alert used by the {@link pages/ColumnMatching ColumnMatching} page.
 * @param props.infoAlertRef - The alert ref for the info alert used by the {@link pages/ColumnMatching ColumnMatching} page.
 * @returns A data grid for the user to match columns
 * @category Component
 * @example
 * ```ts
 * <ColumnsDataGrid errorAlertRef={errorAlertRef} infoAlertRef={infoAlertRef} />
 * ```
 */
export default function MatchesDataGrid({
  errorAlertRef,
  infoAlertRef,
}: Readonly<Props>) {
  const columnsLength = useAppSelector(getColumnsLength)
  const columnComparer = useAppSelector(getColumnComparer)
  const matchComparer = useAppSelector(getMatchColumnsComparer)
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

  const columnsDefinition: readonly TableColumnDefinition<number>[] = useMemo(
    () => [
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
      createTableColumn({
        columnId: 'visit',
        compare: visitsComparer,
        renderCell: (pos) => (
          <MemoizedVisitsCell alertRef={errorAlertRef} pos={pos} />
        ),
        renderHeaderCell: f.constant(
          <HeaderCell header="Visit" subtitle="The matching visit number" />,
        ),
      }),
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
    ],
    [
      columnComparer,
      matchComparer,
      visitsComparer,
      scoreComparer,
      errorAlertRef,
    ],
  )

  useInferVisitAlert(infoAlertRef)
  useFetchMatches(stopLoading)

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
