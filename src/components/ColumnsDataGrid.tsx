import type {
  DataGridCellFocusMode,
  DataGridProps,
  DialogProps,
  TableColumnDefinition,
} from '@fluentui/react-components'
import {
  createTableColumn,
  Subtitle1,
  Button,
  Spinner,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
} from '@fluentui/react-components'
import {
  useState,
  useSyncExternalStore,
  useMemo,
  useCallback,
  startTransition,
} from 'react'
import { columnStateStore } from '@/lib/StateStore/column'
import SimpleDataGrid from './SimpleDataGrid'
import { ProgressState } from '@/lib/StateStore/progress'
import { progressStateStore } from '@/lib/StateStore/progress'
import { useNavigate } from 'react-router-dom'
import type { ColumnNameData } from '@/hooks'
import { useColumnNameMatches } from '@/hooks'
import MatchCell from './Cells/MatchCell'
import ScoreCell from './Cells/ScoreCell'
import HeaderCell from './Cells/HeaderCell'

const ColumnsDataGrid = () => {
  const navigate = useNavigate()
  const [isPending, columnNames] = useColumnNameMatches()

  const selectedColumns = Array.from(
    useSyncExternalStore(
      columnStateStore.subscribe,
      () => columnStateStore.columns,
    ),
  )

  const selectedIndices = useMemo(
    () =>
      columnNames.map(({ matches, position }) =>
        matches.findIndex(
          (match) => match.item.name === selectedColumns[position],
        ),
      ),
    [selectedColumns, columnNames],
  )

  const [sortState, setSortState] = useState<
    Parameters<NonNullable<DataGridProps['onSortChange']>>[1]
  >({
    sortColumn: 'matches',
    sortDirection: 'ascending',
  })

  const [alertOpen, setAlertOpen] = useState(false)

  const handleSortChange: Required<DataGridProps>['onSortChange'] = useCallback(
    (_event, nextSortState) => {
      startTransition(() => {
        setSortState(nextSortState)
      })
    },
    [],
  )

  const handleAlertOpen: Required<DialogProps>['onOpenChange'] = useCallback(
    (_event, data) => {
      setAlertOpen(data.open)
    },
    [],
  )

  const getCellFocusMode = useCallback((): DataGridCellFocusMode => {
    return 'none'
  }, [])

  const originalColumn = useMemo(
    () =>
      createTableColumn<ColumnNameData>({
        columnId: 'original',
        compare: (a, b) => a.original.localeCompare(b.original),
        renderHeaderCell: () => (
          <HeaderCell
            header="Original"
            subtitle="The loaded column names (raw)"
          />
        ),
        renderCell: ({ original }) => <>{original}</>,
      }),
    [],
  )

  const matchColumn = useMemo(
    () =>
      createTableColumn<ColumnNameData>({
        columnId: 'matches',
        compare: (a, b) =>
          (
            a.matches[selectedIndices[a.position] ?? 0]?.item.name ?? ''
          ).localeCompare(
            b.matches[selectedIndices[b.position] ?? 0]?.item.name ?? '',
          ),
        renderHeaderCell: () => (
          <HeaderCell
            header="Replacement"
            subtitle="List of possible replacements (sorted by score)"
          />
        ),
        renderCell: (item) => (
          <MatchCell item={item} setAlertOpen={setAlertOpen} />
        ),
      }),
    [selectedIndices],
  )

  const scoreColumn = useMemo(
    () =>
      createTableColumn<ColumnNameData>({
        columnId: 'score',
        compare: (a, b) => {
          return (
            (a.matches[selectedIndices[a.position] ?? 0]?.score ?? 1) -
            (b.matches[selectedIndices[b.position] ?? 0]?.score ?? 1)
          )
        },
        renderHeaderCell: () => (
          <HeaderCell
            header="Score"
            subtitle="The fuzzy search score (1 indicates a perfect match)"
          />
        ),
        renderCell: (item) => <ScoreCell item={item} />,
      }),
    [selectedIndices],
  )

  const columns: TableColumnDefinition<ColumnNameData>[] = useMemo(
    () => [originalColumn, matchColumn, scoreColumn],
    [matchColumn, originalColumn, scoreColumn],
  )

  return columnNames.length > 0 && !isPending ? (
    <>
      <SimpleDataGrid<ColumnNameData, ColumnNameData>
        items={columnNames}
        columns={columns}
        sortState={sortState}
        onSortChange={handleSortChange}
        sortable
        focusMode="composite"
        cellFocusMode={getCellFocusMode}
      />
      <Dialog modalType="alert" open={alertOpen} onOpenChange={handleAlertOpen}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Column Matching Error</DialogTitle>
            <DialogContent>
              You have selected the same column multiple times. Changes will not
              be made.
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="primary">Okay</Button>
              </DialogTrigger>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
      <div>
        <Button
          appearance="primary"
          onClick={() => {
            progressStateStore.state = ProgressState.MATCHED
            navigate('/EDA')
          }}>
          Done
        </Button>
      </div>
    </>
  ) : (
    <Spinner
      size="huge"
      labelPosition="below"
      label={<Subtitle1>Matching columns...</Subtitle1>}
    />
  )
}

export default ColumnsDataGrid
