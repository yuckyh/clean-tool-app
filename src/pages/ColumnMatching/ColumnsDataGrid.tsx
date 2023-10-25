import type { AlertRef } from '@/components/AlertDialog'
import type { Props as SimpleDataGridProps } from '@/components/SimpleDataGrid'
import type {
  DataGridCellFocusMode,
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
import { getColumnComparer, getColumnsLength } from '@/features/sheet/selectors'
import { promisedTask, promisedTaskOption } from '@/lib/fp'
import {
  useAppDispatch,
  useAppSelector,
  useLoadingTransition,
} from '@/lib/hooks'
import { dumpError } from '@/lib/logger'
import { createLazyMemo, createMemo } from '@/lib/utils'
import {
  Spinner,
  Subtitle1,
  createTableColumn,
} from '@fluentui/react-components'
import { makeBy } from 'fp-ts/ReadonlyArray'
import * as T from 'fp-ts/Task'
import * as TO from 'fp-ts/TaskOption'
import { constant, identity, pipe } from 'fp-ts/function'
import { useCallback, useEffect, useMemo, useState } from 'react'

import HeaderCell from './HeaderCell'
import ValueCell from './ValueCell'

interface Props {
  errorAlertRef: RefObject<AlertRef>
  infoAlertRef: RefObject<AlertRef>
}

const MemoizedMatchCell = createLazyMemo(
  'MemoizedMatchCell',
  () => import('@/features/columns/components/MatchCell'),
)
const MemoizedScoreCell = createLazyMemo(
  'MemoizedScoreCell',
  () => import('@/features/columns/components/ScoreCell'),
)
const MemoizedVisitsCell = createLazyMemo(
  'MemoizedVisitsCell',
  () => import('@/features/columns/components/VisitsCell'),
)
const MemoizedDataGrid = createMemo<SimpleDataGridProps<number>>(
  'MemoizedDataGrid',
  SimpleDataGrid,
)

const cellFocusMode: () => DataGridCellFocusMode = constant('none')
const focusMode: DataGridFocusMode = 'composite'

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

  const items = useMemo(() => makeBy(columnsLength, identity), [columnsLength])

  const columnsDefinition: readonly TableColumnDefinition<number>[] =
    useMemo(() => {
      const initial = [
        createTableColumn({
          columnId: 'original',
          compare: columnComparer,
          renderCell: (pos) => <ValueCell pos={pos} />,
          renderHeaderCell: constant(
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
          renderHeaderCell: constant(
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
                renderHeaderCell: constant(
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
          renderHeaderCell: constant(
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
    pipe(
      matchVisits.length,
      TO.fromPredicate((length) => length === 0),
      pipe(fetchSheet, constant, TO.map),
      TO.tap((x) => pipe(dispatch(x()), promisedTaskOption)),
      pipe(fetchMatches, constant, TO.map),
      pipe(fetchMatches, T.of, constant, TO.getOrElse),
      T.flatMap((x) => pipe(dispatch(x()), promisedTask)),
      T.tap(() =>
        T.of(
          Math.max(...matchVisits) > visits.length && visits.length > 0
            ? infoAlertRef.current?.open()
            : undefined,
        ),
      ),
      T.tapIO(constant(stopLoading)),
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
        cellFocusMode={cellFocusMode}
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
