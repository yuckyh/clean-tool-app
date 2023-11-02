import type { Flag } from '@/features/sheet/reducers'
import type {
  DataGridProps,
  InputProps,
  TableColumnDefinition,
} from '@fluentui/react-components'

import SimpleDataGrid from '@/components/SimpleDataGrid'
import {
  getFormattedColumn,
  getSearchedDataType,
  getSearchedPos,
} from '@/features/columns/selectors'
import { syncFlaggedCells } from '@/features/sheet/reducers'
import {
  getFlaggedRows,
  getIndexedRow,
  getIndexedRowIncorrects,
  getIndexedRowMissings,
} from '@/features/sheet/selectors'
import { getIndexedIndex } from '@/lib/array'
import { isCorrectNumber } from '@/lib/fp'
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
import * as f from 'fp-ts/function'
import * as N from 'fp-ts/number'
import * as S from 'fp-ts/string'
import { useCallback, useMemo, useState } from 'react'

import FilterInput from '../FilterInput'
import ValueCell from './ValueCell'

const useClasses = makeStyles({
  card: {
    width: '100%',
    ...shorthands.margin(0, 'auto'),
    ...shorthands.padding(tokens.spacingHorizontalXXXL, '5%'),
  },
  columnHeader: {
    display: 'flex',
    fontWeight: 'bold',
    justifyContent: 'center',
    width: '100%',
    ...shorthands.padding(0, tokens.spacingHorizontalS),
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

export interface Props {
  column: string
  visit: string
}

export default function AllDataGrid({ column, visit }: Readonly<Props>) {
  const classes = useClasses()

  const pos = useAppSelector((state) => getSearchedPos(state, column, visit))
  const title = useAppSelector((state) => getFormattedColumn(state, pos))

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
  const dataType = useAppSelector((state) =>
    getSearchedDataType(state, column, visit),
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

    const checkedPosList = f.pipe(
      subtractor,
      RS.difference(S.Eq)(subtractee),
      RS.toReadonlyArray(S.Ord),
      RA.filter((checkedPos) => RA.elem(S.Eq)(checkedPos)(indices)),
    )

    const payloads = f.pipe(
      checkedPosList,
      RA.map((currentIndex) => [currentIndex, title, 'outlier'] as Flag),
    )

    const missingPayloads = f.pipe(
      checkedPosList,
      RA.filter((checkedPos) => RA.elem(S.Eq)(checkedPos)(missingIndices)),
      RA.map((currentIndex) => [currentIndex, title, 'missing'] as Flag),
    )

    const incorrectPayloads = f.pipe(
      checkedPosList,
      RA.filter((checkedPos) => RA.elem(S.Eq)(checkedPos)(incorrectIndices)),
      RA.map((currentIndex) => [currentIndex, title, 'incorrect'] as Flag),
    )

    return f.pipe(
      [...payloads, ...missingPayloads, ...incorrectPayloads] as const,
      RA.map(f.flow(syncFlaggedCells, (x) => dispatch(x), IO.of)),
      IO.sequenceArray,
    )()
  }

  const [indexFilter, setIndexFilter] = useState('')
  const [valueFilter, setValueFilter] = useState('')

  const filteredRows = useMemo(
    () =>
      f.pipe(
        series,
        RA.filter(
          f.flow(
            RA.zip([indexFilter, valueFilter] as const),
            RA.every(([x, y]) =>
              f.pipe(y, S.toLowerCase, S.includes)(S.toLowerCase(x)),
            ),
          ),
        ),
      ),
    [indexFilter, series, valueFilter],
  )

  const [sortState, setSortState] = useState<
    Parameters<Required<DataGridProps>['onSortChange']>[1]
  >({ sortColumn: '', sortDirection: 'ascending' })

  const handleSortChange: Required<DataGridProps>['onSortChange'] = useCallback(
    (_event, nextSortState) => {
      setSortState(nextSortState)
    },
    [],
  )

  const columnsDefinition: TableColumnDefinition<readonly [string, string]>[] =
    useMemo(
      () => [
        createTableColumn({
          columnId: 'index',
          compare: ([indexA], [indexB]) => indexA.localeCompare(indexB),
          renderCell: ([index]) => <ValueCell value={index} />,
          renderHeaderCell: f.constant(
            <div className={classes.columnHeader}>sno</div>,
          ),
        }),
        createTableColumn({
          columnId: title,
          compare: ([, valueA], [, valueB]) => {
            const values = [valueA, valueB] as const
            const isBothNum = f.pipe(values, RA.every(isCorrectNumber))

            if (dataType === 'numerical' && isBothNum) {
              return f.pipe(
                RA.map(parseFloat)(values) as [number, number],
                f.tupled(N.Ord.compare),
              )
            }
            if (dataType === 'categorical') {
              return f.pipe(values as [string, string], f.tupled(S.Ord.compare))
            }
            return 0
          },
          renderCell: ([, value]) => <ValueCell value={value} />,
          renderHeaderCell: f.constant(
            <div className={classes.columnHeader}>{title}</div>,
          ),
        }),
      ],
      [classes.columnHeader, dataType, title],
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
        columns={columnsDefinition}
        focusMode="composite"
        getRowId={getIndexedIndex}
        items={filteredRows}
        onSelectionChange={handleSelectionChange}
        onSortChange={handleSortChange}
        selectedItems={flaggedRows}
        selectionMode="multiselect"
        sortState={sortState}
        sortable
      />
    </Card>
  )
}
