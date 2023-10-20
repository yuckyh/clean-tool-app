import type {
  DataGridCellFocusMode,
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
import { constant, identity, pipe } from 'fp-ts/function'
import * as RA from 'fp-ts/ReadonlyArray'
import * as O from 'fp-ts/Option'
import * as S from 'fp-ts/string'
import * as RS from 'fp-ts/ReadonlySet'
import * as IO from 'fp-ts/IO'
import * as N from 'fp-ts/number'
import type { Flag } from '@/features/sheet/reducers'
import { syncFlaggedCells, FlagEq } from '@/features/sheet/reducers'
import { getIndexedIndex } from '@/lib/array'
import FilterInput from './FilterInput'

type IndexedSeries = readonly (readonly [string, string])[]

interface Props {
  series: IndexedSeries
  title: string
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

export default function FlaggedDataGrid({ series, title }: Readonly<Props>) {
  const classes = useClasses()

  const dispatch = useAppDispatch()

  const flaggedCells = useAppSelector(({ sheet }) => sheet.flaggedCells)

  const flaggedRows = useMemo(
    () =>
      pipe(
        flaggedCells,
        RA.filter(
          ([, flagTitle, , flagReason]) =>
            flagTitle === title && flagReason === 'outlier',
        ),
        RS.fromReadonlyArray(FlagEq),
        RS.map(N.Eq)(([, , index]) => index),
      ),
    [flaggedCells, title],
  )

  const handleSelectionChange: DataGridProps['onSelectionChange'] = (
    _1,
    { selectedItems },
  ) => {
    const subtractor =
      flaggedRows.size < selectedItems.size ? selectedItems : flaggedRows

    const subtractee =
      flaggedRows.size < selectedItems.size ? flaggedRows : selectedItems

    const checkedIndex = pipe(
      subtractor as Readonly<Set<number>>,
      RS.difference(N.Eq)(subtractee as Readonly<Set<number>>),
      RS.reduce(N.Ord)(0, N.MonoidSum.concat),
    )

    const payload = pipe(
      series,
      RA.map(getIndexedIndex),
      RA.lookup(checkedIndex),
      O.getOrElse(constant('')),
      (x) => [x, title, checkedIndex, 'outlier'] as Flag,
    )

    pipe(payload, syncFlaggedCells, (x) => dispatch(x), IO.of)()

    return undefined
  }

  const [indexFilter, setIndexFilter] = useState('')
  const [valueFilter, setValueFilter] = useState('')

  const filteredRows = useMemo(
    () =>
      pipe(
        series,
        RA.filter(
          ([index, value]) =>
            pipe(
              indexFilter,
              S.toLowerCase,
              S.includes,
            )(pipe(index, S.toLowerCase)) &&
            pipe(
              valueFilter,
              S.toLowerCase,
              S.includes,
            )(pipe(value, S.toLowerCase)),
        ),
      ),
    [indexFilter, series, valueFilter],
  )

  const items = useMemo(
    () => RA.makeBy(filteredRows.length, identity),
    [filteredRows.length],
  )

  const columnsDefinition = useMemo(
    () => [
      createTableColumn<number>({
        renderHeaderCell: constant(
          <div className={classes.columnHeader}>sno</div>,
        ),
        renderCell: (row) => filteredRows[row]?.[0],
        columnId: 'index',
      }),
      createTableColumn<number>({
        renderHeaderCell: constant(
          <div className={classes.columnHeader}>{title}</div>,
        ),
        renderCell: (row) => filteredRows[row]?.[1],
        columnId: title,
      }),
    ],
    [classes.columnHeader, filteredRows, title],
  )

  const handleValueFilter: Required<InputProps>['onChange'] = useCallback(
    ({ target }) => {
      const { value } = target
      setValueFilter(value)
      return undefined
    },
    [],
  )

  const handleIndexFilter: Required<InputProps>['onChange'] = useCallback(
    ({ target }) => {
      const { value } = target
      setIndexFilter(value)
      return undefined
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
        items={items as number[]}
      />
    </Card>
  )
}
