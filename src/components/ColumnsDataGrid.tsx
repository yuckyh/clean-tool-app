import type {
  DataGridFocusMode,
  DataGridProps,
} from '@fluentui/react-components'
import type { Props as SimpleDataGridProps } from '@/components/SimpleDataGrid'
import type { AlertRef } from '@/components/AlertDialog'
import type { RefObject } from 'react'

import {
  getVisitsComparer,
  getMatchComparer,
  getScoreComparer,
} from '@/features/columns/selectors'
import {
  getColumnComparer,
  getColumns,
  getColumn,
} from '@/features/sheet/selectors'
import {
  useLoadingTransition,
  useAppDispatch,
  useAppSelector,
} from '@/lib/hooks'
import {
  createTableColumn,
  Subtitle1,
  Spinner,
} from '@fluentui/react-components'
import { useCallback, useEffect, useState, useMemo, memo } from 'react'
import { saveSheetState, pushVisit } from '@/features/sheet/reducers'
import { saveColumnState } from '@/features/columns/reducers'
import { fetchMatches } from '@/features/columns/actions'
import { fetchWorkbook } from '@/features/sheet/actions'
import SimpleDataGrid from '@/components/SimpleDataGrid'
import HeaderCell from '@/components/Cells/HeaderCell'
import { useBeforeUnload } from 'react-router-dom'
import { createLazyMemo } from '@/lib/utils'
import Loader from '@/components/Loader'
import { range } from '@/lib/array'

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

const ColumnsDataGrid = ({ alertRef }: Props) => {
  const dispatch = useAppDispatch()

  const fileName = useAppSelector(({ sheet }) => sheet.fileName)
  const visits = useAppSelector(({ sheet }) => sheet.visits)
  const matchLists = useAppSelector(({ columns }) => columns.matchLists)
  const matchVisits = useAppSelector(({ columns }) => columns.matchVisits)
  const originalColumns = useAppSelector((state) => getColumns(state))
  const columnComparer = useAppSelector((state) => getColumnComparer(state))
  const matchComparer = useAppSelector(getMatchComparer)
  const visitsComparer = useAppSelector(getVisitsComparer)
  const scoreComparer = useAppSelector(getScoreComparer)

  const [isLoading, setIsLoading] = useLoadingTransition()

  const [sortState, setSortState] = useState<
    Parameters<NonNullable<DataGridProps['onSortChange']>>[1]
  >({ sortDirection: 'ascending', sortColumn: '' })

  const handleSortChange: Required<DataGridProps>['onSortChange'] = useCallback(
    (_event, nextSortState) => {
      setSortState(nextSortState)
    },
    [],
  )

  useEffect(() => {
    if (!fileName) {
      return
    }

    void dispatch(fetchWorkbook(fileName))
  }, [dispatch, fileName])

  useEffect(() => {
    if (!originalColumns.length) {
      return
    }

    void dispatch(fetchMatches()).then(() => {
      setIsLoading(false)
    })
  }, [dispatch, originalColumns.length, setIsLoading])

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

  const cellFocusMode = useCallback(() => 'none', [])
  const focusMode = useMemo<DataGridFocusMode>(() => 'composite', [])

  useEffect(() => {
    if (!matchVisits.length) {
      return
    }

    const newVisitsLength = Math.max(...matchVisits) + 1

    const visitsLengthDiff = newVisitsLength - visits.length

    if (visitsLengthDiff > 0) {
      range(visitsLengthDiff - visits.length).forEach(() =>
        dispatch(pushVisit()),
      )
    }
  }, [dispatch, matchVisits, visits.length])

  useBeforeUnload(
    useCallback(() => {
      dispatch(saveSheetState())
      dispatch(saveColumnState())
    }, [dispatch]),
  )

  return !isLoading ? (
    <Loader
      label={<Subtitle1>Matching columns...</Subtitle1>}
      labelPosition="below"
      size="huge">
      <MemoizedDataGrid
        items={range(matchLists.length)}
        onSortChange={handleSortChange}
        cellFocusMode={cellFocusMode}
        columns={columnsDefinition}
        focusMode={focusMode}
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

interface ValueCellProps {
  pos: number
}

const ValueCell = ({ pos }: ValueCellProps) => {
  const column = useAppSelector((state) => getColumn(state, true, pos))

  return <div>{column}</div>
}

export default ColumnsDataGrid
