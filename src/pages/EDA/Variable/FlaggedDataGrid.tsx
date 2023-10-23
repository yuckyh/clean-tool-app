import type {
  DataGridCellFocusMode,
  TableColumnDefinition,
  DataGridProps,
  InputProps,
} from '@fluentui/react-components'

import {
  createTableColumn,
  makeStyles,
  shorthands,
  tokens,
  Title2,
  Card,
} from '@fluentui/react-components'
import { useCallback, useState, useMemo } from 'react'
import SimpleDataGrid from '@/components/SimpleDataGrid'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { constant, pipe, flow } from 'fp-ts/function'
import * as RA from 'fp-ts/ReadonlyArray'
import * as S from 'fp-ts/string'
import * as RS from 'fp-ts/ReadonlySet'
import * as IO from 'fp-ts/IO'
import type { Flag } from '@/features/sheet/reducers'
import { syncFlaggedCells } from '@/features/sheet/reducers'
import { getIndexedIndex, getIndexedValue } from '@/lib/array'
import {
  getIndexedRowIncorrects,
  getIndexedRowMissings,
  getFlaggedRows,
  getIndexedRow,
} from '@/features/sheet/selectors'
import FilterInput from './FilterInput'

interface Props {
  column: string
  title: string
  visit: string
}

const useClasses = makeStyles({
  card: {
    width: '100%',
    ...shorthands.margin(0, 'auto'),
    ...shorthands.padding(tokens.spacingHorizontalXXXL, '5%'),
  },
  columns: {
    columnGap: tokens.spacingVerticalXL,
    display: 'flex',
    width: '100%',
  },
  columnHeader: {
    fontWeight: 'bold',
  },
  input: {
    minWidth: '150px',
  },
})

const cellFocusMode: () => DataGridCellFocusMode = constant('none')

export default function FlaggedDataGrid({
  column,
  visit,
  title,
}: Readonly<Props>) {
  const classes = useClasses()

  const dispatch = useAppDispatch()

  const series = useAppSelector((state) => getIndexedRow(state, column, visit))
  const missingSeries = useAppSelector((state) =>
    getIndexedRowMissings(state, column, visit),
  )
  const incorrectSeries = useAppSelector((state) =>
    getIndexedRowIncorrects(state, column, visit),
  )

  const flaggedRows = useAppSelector((state) =>
    getFlaggedRows(state, title, 'outlier'),
  )

  const indices = useMemo(() => RA.map(getIndexedIndex)(series), [series])
  const missingIndices = useMemo(
    () => RA.map(getIndexedIndex)(missingSeries),
    [missingSeries],
  )
  const incorrectIndices = useMemo(
    () => RA.map(getIndexedIndex)(incorrectSeries),
    [incorrectSeries],
  )

  const handleSelectionChange: DataGridProps['onSelectionChange'] = (
    _1,
    { selectedItems },
  ) => {
    const shouldAdd = flaggedRows.size < selectedItems.size
    const subtractor = (
      shouldAdd ? selectedItems : flaggedRows
    ) as ReadonlySet<string>

    const subtractee = (
      shouldAdd ? flaggedRows : selectedItems
    ) as ReadonlySet<string>

    const checkedPosList = pipe(
      subtractor,
      RS.difference(S.Eq)(subtractee),
      RS.toReadonlyArray(S.Ord),
      RA.filter((checkedPos) => RA.elem(S.Eq)(checkedPos)(indices)),
    )

    const payloads = pipe(
      checkedPosList,
      RA.map((currentIndex) => [currentIndex, title, 'outlier'] as Flag),
    )

    const missingPayloads = pipe(
      checkedPosList,
      RA.filter((checkedPos) => RA.elem(S.Eq)(checkedPos)(missingIndices)),
      RA.map((currentIndex) => [currentIndex, title, 'missing'] as Flag),
    )

    const incorrectPayloads = pipe(
      checkedPosList,
      RA.filter((checkedPos) => RA.elem(S.Eq)(checkedPos)(incorrectIndices)),
      RA.map((currentIndex) => [currentIndex, title, 'incorrect'] as Flag),
    )

    return pipe(
      [...payloads, ...missingPayloads, ...incorrectPayloads] as const,
      RA.map(flow(syncFlaggedCells, (x) => dispatch(x), IO.of)),
      IO.sequenceArray,
    )()
  }

  const [indexFilter, setIndexFilter] = useState('')
  const [valueFilter, setValueFilter] = useState('')

  const filteredRows = useMemo(
    () =>
      pipe(
        series,
        RA.filter(
          flow(
            RA.zip([indexFilter, valueFilter] as const),
            RA.every(([x, y]) =>
              pipe(y, S.toLowerCase, S.includes)(S.toLowerCase(x)),
            ),
          ),
        ),
      ),
    [indexFilter, series, valueFilter],
  )

  const columnsDefinition: TableColumnDefinition<readonly [string, string]>[] =
    useMemo(
      () => [
        createTableColumn({
          renderHeaderCell: constant(
            <div className={classes.columnHeader}>sno</div>,
          ),
          renderCell: getIndexedIndex,
          columnId: 'index',
        }),
        createTableColumn({
          renderHeaderCell: constant(
            <div className={classes.columnHeader}>{title}</div>,
          ),
          renderCell: getIndexedValue,
          columnId: title,
        }),
      ],
      [classes.columnHeader, title],
    )

  const handleValueFilter: Required<InputProps>['onChange'] = useCallback(
    ({ target }) => {
      const { value } = target
      setValueFilter(value)
    },
    [],
  )

  const handleIndexFilter: Required<InputProps>['onChange'] = useCallback(
    ({ target }) => {
      const { value } = target
      setIndexFilter(value)
    },
    [],
  )

  return (
    <Card className={classes.card} size="large">
      <Title2>Data Flagging</Title2>
      <div className={classes.columns}>
        <FilterInput
          handleChange={handleIndexFilter}
          value={indexFilter}
          label="Search sno"
        />
        <FilterInput
          handleChange={handleValueFilter}
          label="Search values"
          value={valueFilter}
        />
      </div>
      <SimpleDataGrid
        onSelectionChange={handleSelectionChange}
        cellFocusMode={cellFocusMode}
        selectionMode="multiselect"
        selectedItems={flaggedRows}
        columns={columnsDefinition}
        getRowId={getIndexedIndex}
        items={filteredRows}
      />
    </Card>
  )
}
