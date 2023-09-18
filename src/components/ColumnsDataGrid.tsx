// import { useNavigate } from 'react-router-dom'
import type { ColumnNameData } from '@/hooks'
import type {
  DataGridCellFocusMode,
  DataGridProps,
  DialogProps,
  TableColumnDefinition,
} from '@fluentui/react-components'

import { useAppDispatch, useAppSelector, useColumnNameMatches } from '@/hooks'
import { setProgress } from '@/store/progressSlice'
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Spinner,
  Subtitle1,
  createTableColumn,
} from '@fluentui/react-components'
import { startTransition, useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import HeaderCell from './Cells/HeaderCell'
import MatchCell from './Cells/MatchCell'
import ScoreCell from './Cells/ScoreCell'
import SimpleDataGrid from './SimpleDataGrid'

const ColumnsDataGrid = () => {
  const navigate = useNavigate()
  const { matchIndices } = useAppSelector(({ columns }) => columns)
  const dispatch = useAppDispatch()

  const [isPending, columnNames] = useColumnNameMatches()

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
        renderCell: ({ original }) => <>{original}</>,
        renderHeaderCell: () => (
          <HeaderCell
            header="Original"
            subtitle="The loaded column names (raw)"
          />
        ),
      }),
    [],
  )

  const matchColumn = useMemo(
    () =>
      createTableColumn<ColumnNameData>({
        columnId: 'matches',
        compare: (a, b) =>
          (
            a.matches[matchIndices[a.position] ?? 0]?.item.name ?? ''
          ).localeCompare(
            b.matches[matchIndices[b.position] ?? 0]?.item.name ?? '',
          ),
        renderCell: (item) => (
          <MatchCell item={item} setAlertOpen={setAlertOpen} />
        ),
        renderHeaderCell: () => (
          <HeaderCell
            header="Replacement"
            subtitle="List of possible replacements (sorted by score)"
          />
        ),
      }),
    [matchIndices],
  )

  const scoreColumn = useMemo(
    () =>
      createTableColumn<ColumnNameData>({
        columnId: 'score',
        compare: (a, b) => {
          return (
            (a.matches[matchIndices[a.position] ?? 0]?.score ?? 1) -
            (b.matches[matchIndices[b.position] ?? 0]?.score ?? 1)
          )
        },
        renderCell: (item) => <ScoreCell item={item} />,
        renderHeaderCell: () => (
          <HeaderCell
            header="Score"
            subtitle="The fuzzy search score (1 indicates a perfect match)"
          />
        ),
      }),
    [matchIndices],
  )

  const columnDefinitions: TableColumnDefinition<ColumnNameData>[] = useMemo(
    () => [originalColumn, matchColumn, scoreColumn],
    [matchColumn, originalColumn, scoreColumn],
  )

  const handleCommitChanges = useCallback(() => {
    dispatch(setProgress('matched'))
    navigate('/EDA')
  }, [dispatch, navigate])

  return columnNames.length > 0 && !isPending ? (
    <>
      <SimpleDataGrid<ColumnNameData, ColumnNameData>
        cellFocusMode={getCellFocusMode}
        columns={columnDefinitions}
        focusMode="composite"
        items={columnNames}
        onSortChange={handleSortChange}
        sortState={sortState}
        sortable
      />
      <Dialog modalType="alert" onOpenChange={handleAlertOpen} open={alertOpen}>
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
        <Button appearance="primary" onClick={handleCommitChanges}>
          Done
        </Button>
      </div>
    </>
  ) : (
    <Spinner
      label={<Subtitle1>Matching columns...</Subtitle1>}
      labelPosition="below"
      size="huge"
    />
  )
}

export default ColumnsDataGrid
