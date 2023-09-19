// import { useNavigate } from 'react-router-dom'
import type { ColumnNameData } from '@/lib/hooks'
import type {
  DataGridCellFocusMode,
  DataGridProps,
  DialogProps,
  TableColumnDefinition,
} from '@fluentui/react-components'

import codebook from '@/../data/codebook.json'
import {
  useAppDispatch,
  useAppSelector,
  useColumnNameMatches,
} from '@/lib/hooks'
import { setMatchVisits } from '@/store/columnsSlice'
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
import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

import HeaderCell from './Cells/HeaderCell'
import MatchCell from './Cells/MatchCell'
import ScoreCell from './Cells/ScoreCell'
import VisitsCell from './Cells/VisitsCell'
import SimpleDataGrid from './SimpleDataGrid'

const ColumnsDataGrid = () => {
  const navigate = useNavigate()
  const { visits } = useAppSelector(({ sheet }) => sheet)
  const { matchRefs, matchVisits, originalColumns } = useAppSelector(
    ({ columns }) => columns,
  )
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
        compare: (a, b) =>
          (originalColumns[a.position] ?? '').localeCompare(
            originalColumns[b.position] ?? '',
          ),
        renderCell: ({ position }) => <>{originalColumns[position] ?? ''}</>,
        renderHeaderCell: () => (
          <HeaderCell
            header="Original"
            subtitle="The loaded column names (raw)"
          />
        ),
      }),
    [originalColumns],
  )

  const getMatchByPos = useCallback(
    (data: ColumnNameData) => codebook[matchRefs[data.position] ?? 0],
    [matchRefs],
  )

  const getMatchByRef = useCallback(
    (data: ColumnNameData) =>
      data.matches[
        data.matches.findIndex(
          ({ refIndex }) => refIndex === matchRefs[data.position],
        )
      ],
    [matchRefs],
  )

  const matchColumn = useMemo(
    () =>
      createTableColumn<ColumnNameData>({
        columnId: 'matches',
        compare: (a, b) =>
          (getMatchByPos(a)?.name ?? '').localeCompare(
            getMatchByPos(b)?.name ?? '',
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
    [getMatchByPos],
  )

  useEffect(() => {
    if (matchVisits.find((visit) => visit >= visits)) {
      dispatch(
        setMatchVisits(matchVisits.map((visit) => Math.min(visit, visits - 1))),
      )
    }
  }, [dispatch, matchVisits, visits])

  const visitColumn = useMemo(
    () =>
      createTableColumn<ColumnNameData>({
        columnId: 'visit',
        renderCell: (item) => (
          <VisitsCell item={item} setAlertOpen={setAlertOpen} />
        ),
        renderHeaderCell: () => (
          <HeaderCell header="Visit" subtitle="The matching visit number" />
        ),
      }),
    [],
  )

  const scoreColumn = useMemo(
    () =>
      createTableColumn<ColumnNameData>({
        columnId: 'score',
        compare: (a, b) =>
          (getMatchByRef(a)?.score ?? 1) - (getMatchByRef(b)?.score ?? 1),
        renderCell: (item) => <ScoreCell item={item} />,
        renderHeaderCell: () => (
          <HeaderCell
            header="Score"
            subtitle="The fuzzy search score (1 indicates a perfect match)"
          />
        ),
      }),
    [getMatchByRef],
  )

  const columnDefinitions: TableColumnDefinition<ColumnNameData>[] = useMemo(
    () => [originalColumn, matchColumn, visitColumn, scoreColumn],
    [matchColumn, originalColumn, scoreColumn, visitColumn],
  )

  const handleCommitChanges = useCallback(() => {
    dispatch(setProgress('matched'))
    navigate('/EDA')
  }, [dispatch, navigate])

  return columnNames.length > 0 && !isPending ? (
    <>
      <SimpleDataGrid
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
