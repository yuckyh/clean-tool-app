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
import { useBeforeUnload } from 'react-router-dom'
import type { Props as SimpleDataGridProps } from '@/components/SimpleDataGrid'
import type { AlertRef } from '@/components/AlertDialog'
import Task from 'fp-ts/Task'

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
import { saveColumnState } from '@/features/columns/reducers'
import { saveSheetState } from '@/features/sheet/reducers'
import { fetchMatches } from '@/features/columns/actions'
import SimpleDataGrid from '@/components/SimpleDataGrid'
import { fetchSheet } from '@/features/sheet/actions'
import { createLazyMemo, createMemo, noOpIO } from '@/lib/utils'
import Loader from '@/components/Loader'

import { constant, identity, pipe } from 'fp-ts/function'
import { makeBy } from 'fp-ts/ReadonlyArray'
import IO from 'fp-ts/IO'
import TE from 'fp-ts/TaskEither'
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

  // eslint-disable-next-line functional/prefer-tacit
  useEffect(() => {
    return pipe(
      columnsLength,
      (length): TE.TaskEither<typeof fetchSheet, typeof fetchMatches> =>
        length === 0 ? TE.left(fetchSheet) : TE.right(fetchMatches),
      TE.getOrElse((x) =>
        pipe(
          Task.tap(() => IO.of(dispatch(x()))),
          () => Task.of(fetchMatches),
        ),
      ),
      Task.tap((x) => IO.of(dispatch(x()))),
      Task.tapIO(stopLoading),
      () => noOpIO,
    )()
  }, [dispatch, columnsLength, stopLoading])

  useBeforeUnload(
    useCallback(() => {
      return pipe(
        [saveSheetState, saveColumnState] as const,
        IO.traverseArray((x) => IO.of(dispatch(x()))),
      )()
    }, [dispatch]),
  )

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
