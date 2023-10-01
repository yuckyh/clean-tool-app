import type { AlertRef } from '@/components/AlertDialog'
import type {
  DataGridProps,
  TableColumnDefinition,
} from '@fluentui/react-components'
import type { RefObject } from 'react'

import HeaderCell from '@/components/Cells/HeaderCell'
import Loader from '@/components/Loader'
import SimpleDataGrid from '@/components/SimpleDataGrid'
import {
  useAppDispatch,
  useAppSelector,
  useAsyncEffect,
  useLoadingTransition,
} from '@/lib/hooks'
import { fluentColorScale } from '@/lib/plotly'
import { createLazyMemo, just } from '@/lib/utils'
import {
  Spinner,
  Subtitle1,
  createTableColumn,
  tokens,
} from '@fluentui/react-components'
import { memo, useMemo, useState } from 'react'

import type { ColumnNameData } from '../features/columnsSlice'

import { fetchMatches } from '../features/columnsSlice'
import { fetchWorkbook, getOriginalColumns } from '../features/sheetSlice'

interface Props {
  alertRef: RefObject<AlertRef>
}

type SimpleDataGridProps = ReturnType<
  typeof SimpleDataGrid<ColumnNameData, ColumnNameData>
>['props']

const MemoizedMatchCell = createLazyMemo(
  'MemoizedMatchCell',
  () => import('./Cells/MatchCell'),
)
const MemoizedScoreCell = createLazyMemo(
  'MemoizedScoreCell',
  () => import('./Cells/ScoreCell'),
)
const MemoizedVisitsCell = createLazyMemo(
  'MemoizedVisitsCell',
  () => import('./Cells/VisitsCell'),
)
const MemoizedDataGrid = memo<SimpleDataGridProps>(SimpleDataGrid)
MemoizedDataGrid.displayName = 'MemoizedDataGrid'

const ColumnsDataGrid = ({ alertRef }: Props) => {
  const dispatch = useAppDispatch()
  const { fileName } = useAppSelector(({ sheet }) => sheet)
  const { matchLists } = useAppSelector(({ columns }) => columns)
  const originalColumns = useAppSelector(getOriginalColumns)
  const [isLoading, setIsLoading] = useLoadingTransition()

  const [sortState, setSortState] = useState<
    Parameters<NonNullable<DataGridProps['onSortChange']>>[1]
  >({
    sortColumn: 'matches',
    sortDirection: 'ascending',
  })

  const colorscale = useMemo(
    () =>
      fluentColorScale(
        tokens.colorStatusSuccessForeground3,
        tokens.colorStatusDangerForeground3,
        64,
      ),
    [],
  )

  const [config] = useState<Partial<Plotly.Config>>({
    displayModeBar: false,
    scrollZoom: false,
  })

  const [layout] = useState<Partial<Plotly.Layout>>({
    autosize: true,

    clickmode: 'none',
    dragmode: false,
    margin: {
      b: 0,
      l: 0,
      r: 0,
      t: 0,
    },
    xaxis: {
      fixedrange: true,
      nticks: 0,
      range: [0, 1],
      showgrid: false,
      showticklabels: false,
      ticks: '',
      zeroline: false,
    },
    yaxis: {
      fixedrange: true,
      nticks: 0,
      showticklabels: false,
      ticks: '',
    },
  })

  const handleSortChange: DataGridProps['onSortChange'] = (
    _event,
    nextSortState,
  ) => {
    setSortState(nextSortState)
  }

  const columnDefinitions: TableColumnDefinition<ColumnNameData>[] = useMemo(
    () => [
      createTableColumn({
        columnId: 'original',
        compare: (a, b) =>
          originalColumns[a.pos]?.localeCompare(originalColumns[b.pos] ?? '') ??
          0,
        renderCell: ({ pos }) => <>{originalColumns[pos]}</>,
        renderHeaderCell: () => (
          <HeaderCell
            header="Original"
            subtitle="The loaded column names (raw)"
          />
        ),
      }),
      createTableColumn<ColumnNameData>({
        columnId: 'matches',
        compare: (...args) => {
          const [a, b] = args.map(
            (arg) =>
              matchLists[arg.pos]?.matches[matchLists[arg.pos]?.index ?? 0] ??
              '',
          ) as [string, string]
          return a.localeCompare(b)
        },
        renderCell: (item) => (
          <MemoizedMatchCell alertRef={alertRef} item={item} />
        ),
        renderHeaderCell: () => (
          <HeaderCell
            header="Replacement"
            subtitle="List of possible replacements (sorted by score)"
          />
        ),
      }),
      createTableColumn({
        columnId: 'visit',
        renderCell: (item) => (
          <MemoizedVisitsCell alertRef={alertRef} item={item} />
        ),
        renderHeaderCell: () => (
          <HeaderCell header="Visit" subtitle="The matching visit number" />
        ),
      }),
      createTableColumn({
        columnId: 'score',
        compare: (...args) =>
          args
            .map(({ pos }) => {
              const { index, scores } = matchLists[pos] ?? {
                index: -1,
                scores: [],
              }
              return scores[index] ?? 1
            })
            .reduce((a, b) => a - b),
        renderCell: (item) => (
          <MemoizedScoreCell
            colorscale={colorscale}
            config={config}
            item={item}
            layout={layout}
          />
        ),
        renderHeaderCell: () => (
          <HeaderCell
            header="Score"
            subtitle="The fuzzy search score (1 indicates a perfect match)"
          />
        ),
      }),
    ],
    [alertRef, colorscale, config, layout, matchLists, originalColumns],
  )

  useAsyncEffect(async () => {
    if (!fileName) {
      return
    }

    await just(fileName)(fetchWorkbook)((x) => dispatch(x))()
  }, [dispatch, fileName])

  useAsyncEffect(async () => {
    if (!originalColumns.length) {
      return
    }

    await just(originalColumns)(fetchMatches)(dispatch)()

    setIsLoading(false)
  }, [dispatch, originalColumns])

  return matchLists.length > 0 || !isLoading ? (
    <Loader
      label={<Subtitle1>Matching columns...</Subtitle1>}
      labelPosition="below"
      size="huge">
      <MemoizedDataGrid
        cellFocusMode={() => 'none'}
        columns={columnDefinitions}
        focusMode="composite"
        items={matchLists}
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

export default ColumnsDataGrid
