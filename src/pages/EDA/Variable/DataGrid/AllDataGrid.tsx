/**
 * @file This file contains the data grid component for flagging all data.
 * @module pages/EDA/Variable/DataGrid/AllDataGrid
 */

import type {
  DataGridProps,
  InputProps,
  TableColumnDefinition,
} from '@fluentui/react-components'

import SimpleDataGrid from '@/components/SimpleDataGrid'
import { getIndexedIndex } from '@/lib/array'
import { isCorrectNumber } from '@/lib/fp'
import * as Flag from '@/lib/fp/Flag'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { syncFlaggedCells } from '@/reducers/data'
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
import {
  selectDataType,
  selectFlaggedRows,
  selectIncorrectSeries,
  selectMissingSeries,
  selectSeries,
  selectSuspectedSeries,
  selectTitle,
} from './selectors'

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

/**
 *
 */
export interface Props {
  /**
   *
   */
  column: string
  /**
   *
   */
  visit: string
}

/**
 * The base data grid for flagging cells across various reasons.
 * @param props - The {@link Props props} for the component.
 * @param props.column - The column of the variable.
 * @param props.visit - The visit of the variable.
 * @returns The component object.
 * @example
 * ```tsx
 *  <AllDataGrid column={column} visit={visit} />
 * ```
 */
export default function AllDataGrid(props: Readonly<Props>) {
  const classes = useClasses()

  const title = useAppSelector(selectTitle(props))

  const dispatch = useAppDispatch()

  const flaggedRows = useAppSelector(selectFlaggedRows(title, 'outlier'))
  const series = useAppSelector(selectSeries(props))
  const missingSeries = useAppSelector(selectMissingSeries(props))
  const incorrectSeries = useAppSelector(selectIncorrectSeries(props))
  const suspectedSeries = useAppSelector(selectSuspectedSeries(props))

  const dataType = useAppSelector(selectDataType(props))

  const indices = useMemo(() => RA.map(getIndexedIndex)(series), [series])
  const missingIndices = useMemo(
    () => RA.map(getIndexedIndex)(missingSeries),
    [missingSeries],
  )
  const incorrectIndices = useMemo(
    () => RA.map(getIndexedIndex)(incorrectSeries),
    [incorrectSeries],
  )
  const suspectedIndices = useMemo(
    () => RA.map(getIndexedIndex)(suspectedSeries),
    [suspectedSeries],
  )

  const handleSelectionChange: DataGridProps['onSelectionChange'] = (
    _event,
    { selectedItems },
  ) => {
    const shouldAdd = flaggedRows.size < selectedItems.size

    const checkedPosList = f.pipe(
      (shouldAdd ? selectedItems : flaggedRows) as ReadonlySet<string>,
      RS.difference(S.Eq)(
        (shouldAdd ? flaggedRows : selectedItems) as ReadonlySet<string>,
      ),
      RS.toReadonlyArray(S.Ord),
      RA.filter((checkedPos) => RA.elem(S.Eq)(checkedPos, indices)),
    )

    const payloads = f.pipe(
      checkedPosList,
      RA.map((currentIndex) => Flag.of(currentIndex, title, 'outlier')),
    )

    const missingPayloads = f.pipe(
      checkedPosList,
      RA.filter((checkedPos) => RA.elem(S.Eq)(checkedPos, missingIndices)),
      RA.map((currentIndex) => Flag.of(currentIndex, title, 'missing')),
    )

    const incorrectPayloads = f.pipe(
      checkedPosList,
      RA.filter((checkedPos) => RA.elem(S.Eq)(checkedPos, incorrectIndices)),
      RA.map((currentIndex) => Flag.of(currentIndex, title, 'incorrect')),
    )

    const suspectedPayloads = f.pipe(
      checkedPosList,
      RA.filter((checkedPos) => RA.elem(S.Eq)(checkedPos, suspectedIndices)),
      RA.map((currentIndex) => Flag.of(currentIndex, title, 'suspected')),
    )

    return f.pipe(
      [
        ...payloads,
        ...missingPayloads,
        ...incorrectPayloads,
        ...suspectedPayloads,
      ] as const,
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

  const columnsDefinition: readonly TableColumnDefinition<
    readonly [string, string]
  >[] = useMemo(
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
