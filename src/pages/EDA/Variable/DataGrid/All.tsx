import type { Flag } from '@/features/sheet/reducers'
import type {
  DataGridCellFocusMode,
  DataGridProps,
  InputProps,
  TableColumnDefinition,
} from '@fluentui/react-components'

import SimpleDataGrid from '@/components/SimpleDataGrid'
import { getDataType } from '@/features/columns/selectors'
import { syncFlaggedCells } from '@/features/sheet/reducers'
import {
  getFlaggedRows,
  getIndexedRow,
  getIndexedRowIncorrects,
  getIndexedRowMissings,
} from '@/features/sheet/selectors'
import { getIndexedIndex, getIndexedValue } from '@/lib/array'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
  Body2,
  Card,
  Title2,
  createTableColumn,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import * as IO from 'fp-ts/IO'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RS from 'fp-ts/ReadonlySet'
import { constant, flow, pipe } from 'fp-ts/function'
import * as S from 'fp-ts/string'
import { useCallback, useMemo, useState } from 'react'

import FilterInput from '../FilterInput'

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
  columnHeader: {
    fontWeight: 'bold',
  },
  columns: {
    columnGap: tokens.spacingVerticalXL,
    display: 'flex',
    width: '100%',
  },
  input: {
    minWidth: '150px',
  },
  rows: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalXL,
    width: '100%',
  },
})

const cellFocusMode: () => DataGridCellFocusMode = constant('none')

export default function AllDataGrid({ column, title, visit }: Readonly<Props>) {
  const classes = useClasses()

  const dispatch = useAppDispatch()

  const flaggedRows = useAppSelector((state) =>
    getFlaggedRows(state, title, 'outlier'),
  )
  const series = useAppSelector((state) => getIndexedRow(state, column, visit))
  const missingSeries = useAppSelector((state) =>
    getIndexedRowMissings(state, column, visit),
  )
  const incorrectSeries = useAppSelector((state) =>
    getIndexedRowIncorrects(state, column, visit),
  )
  const dataType = useAppSelector((state) => getDataType(state, column, visit))

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
          columnId: 'index',
          renderCell: getIndexedIndex,
          renderHeaderCell: constant(
            <div className={classes.columnHeader}>sno</div>,
          ),
        }),
        createTableColumn({
          columnId: title,
          renderCell: getIndexedValue,
          renderHeaderCell: constant(
            <div className={classes.columnHeader}>{title}</div>,
          ),
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
      <Title2>All Data</Title2>
      <Body2>Filter and sort your data to flag them here</Body2>
      <div className={classes.columns}>
        <div className={classes.rows}>
          <FilterInput
            handleChange={handleIndexFilter}
            label="Search sno"
            value={indexFilter}
          />
        </div>
        <div className={classes.rows}>
          <FilterInput
            handleChange={handleValueFilter}
            label="Search values"
            value={valueFilter}
          />
        </div>
      </div>
      <SimpleDataGrid
        cellFocusMode={cellFocusMode}
        columns={columnsDefinition}
        getRowId={getIndexedIndex}
        items={filteredRows}
        onSelectionChange={handleSelectionChange}
        selectedItems={flaggedRows}
        selectionMode="multiselect"
      />
    </Card>
  )
}
