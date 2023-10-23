import type {
  DataGridCellFocusMode,
  TableColumnDefinition,
  DataGridFocusMode,
  DataGridProps,
} from '@fluentui/react-components'
import type { RefObject } from 'react'
import {
  createTableColumn,
  Subtitle1,
  Spinner,
} from '@fluentui/react-components'
import { useCallback, useEffect, useState, useMemo } from 'react'
import type { Props as SimpleDataGridProps } from '@/components/SimpleDataGrid'
import type { AlertRef } from '@/components/AlertDialog'
import * as T from 'fp-ts/Task'

import {
  getVisitsComparer,
  getMatchComparer,
  getScoreComparer,
} from '@/features/columns/selectors'
import {
  useLoadingTransition,
  useAppDispatch,
  useAppSelector,
} from '@/lib/hooks'
import { getColumnComparer, getColumnsLength } from '@/features/sheet/selectors'
import { fetchMatches } from '@/features/columns/actions'
import SimpleDataGrid from '@/components/SimpleDataGrid'
import { fetchSheet } from '@/features/sheet/actions'
import { createLazyMemo, createMemo } from '@/lib/utils'
import Loader from '@/components/Loader'

import { constant, identity, pipe } from 'fp-ts/function'
import { makeBy } from 'fp-ts/ReadonlyArray'
import * as TO from 'fp-ts/TaskOption'
import { dumpError } from '@/lib/logger'
import { promisedTaskOption, promisedTask } from '@/lib/fp'
import HeaderCell from './HeaderCell'
import ValueCell from './ValueCell'

interface Props {
  alertRef: RefObject<AlertRef>
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

export default function ColumnsDataGrid({ alertRef }: Readonly<Props>) {
  const dispatch = useAppDispatch()

  const columnsLength = useAppSelector(getColumnsLength)
  const matchVisitsLength = useAppSelector(
    ({ columns }) => columns.matchVisits.length,
  )

  const columnComparer = useAppSelector(getColumnComparer)
  const matchComparer = useAppSelector(getMatchComparer)
  const visitsComparer = useAppSelector(getVisitsComparer)
  const scoreComparer = useAppSelector(getScoreComparer)

  const [isLoading, stopLoading] = useLoadingTransition()

  const [sortState, setSortState] = useState<
    Parameters<NonNullable<DataGridProps['onSortChange']>>[1]
  >({ sortDirection: 'ascending', sortColumn: '' })

  const handleSortChange: Required<DataGridProps>['onSortChange'] = useCallback(
    (_event, nextSortState) => {
      setSortState(nextSortState)

      return undefined
    },
    [],
  )

  const items = useMemo(() => makeBy(columnsLength, identity), [columnsLength])

  const columnsDefinition: readonly TableColumnDefinition<number>[] = useMemo(
    () => [
      createTableColumn({
        renderHeaderCell: constant(
          <HeaderCell
            subtitle="The loaded column names (raw)"
            header="Original"
          />,
        ),
        renderCell: (pos) => <ValueCell pos={pos} />,
        compare: columnComparer,
        columnId: 'original',
      }),
      createTableColumn({
        renderHeaderCell: constant(
          <HeaderCell
            subtitle="List of possible replacements (sorted by score)"
            header="Replacement"
          />,
        ),
        renderCell: (pos) => (
          <MemoizedMatchCell alertRef={alertRef} pos={pos} />
        ),
        compare: matchComparer,
        columnId: 'matches',
      }),
      createTableColumn({
        renderHeaderCell: constant(
          <HeaderCell subtitle="The matching visit number" header="Visit" />,
        ),
        renderCell: (pos) => (
          <MemoizedVisitsCell alertRef={alertRef} pos={pos} />
        ),
        compare: visitsComparer,
        columnId: 'visit',
      }),
      createTableColumn({
        renderHeaderCell: constant(
          <HeaderCell
            subtitle="The fuzzy search score (1 indicates a perfect match)"
            header="Score"
          />,
        ),
        renderCell: (pos) => <MemoizedScoreCell pos={pos} />,
        compare: scoreComparer,
        columnId: 'score',
      }),
    ],
    [alertRef, columnComparer, matchComparer, scoreComparer, visitsComparer],
  )

  useEffect(() => {
    pipe(
      matchVisitsLength,
      TO.fromPredicate((length) => length === 0),
      pipe(fetchSheet, constant, TO.map),
      TO.tap((x) => pipe(dispatch(x()), promisedTaskOption)),
      pipe(fetchMatches, constant, TO.map),
      pipe(fetchMatches, T.of, constant, TO.getOrElse),
      T.flatMap((x) => pipe(dispatch(x()), promisedTask)),
      T.tap(T.of),
      T.tapIO(constant(stopLoading)),
    )().catch(dumpError)
    return undefined
  }, [dispatch, columnsLength, stopLoading, matchVisitsLength])

  return !isLoading ? (
    <Loader
      label={<Subtitle1>Matching columns...</Subtitle1>}
      labelPosition="below"
      size="huge">
      <MemoizedDataGrid
        onSortChange={handleSortChange}
        cellFocusMode={cellFocusMode}
        columns={columnsDefinition}
        focusMode={focusMode}
        sortState={sortState}
        items={items}
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
