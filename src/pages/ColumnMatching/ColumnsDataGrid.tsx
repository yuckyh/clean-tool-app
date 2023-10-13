import type {
  DataGridCellFocusMode,
  DataGridFocusMode,
  DataGridProps,
} from '@fluentui/react-components'
import type { RefObject } from 'react'
import {
  createTableColumn,
  Subtitle1,
  Spinner,
} from '@fluentui/react-components'
import { useCallback, useEffect, useState, useMemo, memo } from 'react'
import { useBeforeUnload } from 'react-router-dom'
import type { Props as SimpleDataGridProps } from '@/components/SimpleDataGrid'
import type { AlertRef } from '@/components/AlertDialog'

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
import { createLazyMemo } from '@/lib/utils'
import { just } from '@/lib/monads'
import Loader from '@/components/Loader'
import { range } from '@/lib/array'

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
const MemoizedDataGrid = memo<SimpleDataGridProps<number>>(SimpleDataGrid)
MemoizedDataGrid.displayName = 'MemoizedDataGrid'

const cellFocusMode: () => DataGridCellFocusMode = () => 'none'
const focusMode: DataGridFocusMode = 'composite'

export default function ColumnsDataGrid({ alertRef }: Props) {
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
    },
    [],
  )

  const items = useMemo(() => range(columnsLength), [columnsLength])

  const columnsDefinition = useMemo(
    () => [
      createTableColumn({
        renderHeaderCell: () => (
          <HeaderCell
            subtitle="The loaded column names (raw)"
            header="Original"
          />
        ),
        renderCell: (pos) => <ValueCell pos={pos} />,
        compare: columnComparer,
        columnId: 'original',
      }),
      createTableColumn({
        renderHeaderCell: () => (
          <HeaderCell
            subtitle="List of possible replacements (sorted by score)"
            header="Replacement"
          />
        ),
        renderCell: (pos) => (
          <MemoizedMatchCell alertRef={alertRef} pos={pos} />
        ),
        compare: matchComparer,
        columnId: 'matches',
      }),
      createTableColumn({
        renderHeaderCell: () => (
          <HeaderCell subtitle="The matching visit number" header="Visit" />
        ),
        renderCell: (pos) => (
          <MemoizedVisitsCell alertRef={alertRef} pos={pos} />
        ),
        compare: visitsComparer,
        columnId: 'visit',
      }),
      createTableColumn({
        renderHeaderCell: () => (
          <HeaderCell
            subtitle="The fuzzy search score (1 indicates a perfect match)"
            header="Score"
          />
        ),
        renderCell: (pos) => <MemoizedScoreCell pos={pos} />,
        compare: scoreComparer,
        columnId: 'score',
      }),
    ],
    [alertRef, columnComparer, matchComparer, scoreComparer, visitsComparer],
  )

  useEffect(() => {
    const startFetchMatches = () =>
      just(fetchMatches).pass()((x) => dispatch(x))()

    if (columnsLength) {
      startFetchMatches().catch(console.error).finally(stopLoading)
      return
    }

    just(fetchSheet)
      .pass()((x) => dispatch(x))()
      .then(startFetchMatches)
      .catch(console.error)
      .finally(stopLoading)
  }, [dispatch, columnsLength, stopLoading])

  useBeforeUnload(
    useCallback(() => {
      just(saveSheetState).pass()(dispatch)
      just(saveColumnState).pass()(dispatch)
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
