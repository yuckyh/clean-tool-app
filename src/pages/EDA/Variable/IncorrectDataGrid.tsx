import type {
  DataGridCellFocusMode,
  TableColumnDefinition,
  DataGridProps,
} from '@fluentui/react-components'
import {
  createTableColumn,
  makeStyles,
  shorthands,
  Title2,
  tokens,
  Body1,
  Card,
} from '@fluentui/react-components'
import { useMemo } from 'react'
import SimpleDataGrid from '@/components/SimpleDataGrid'
import { getFilteredFlaggedRows } from '@/features/sheet/selectors'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { constant, pipe } from 'fp-ts/function'
import { getIndexedIndex, getIndexedValue } from '@/lib/array'
import type { Flag } from '@/features/sheet/reducers'
import { syncFlaggedCells } from '@/features/sheet/reducers'
import * as RS from 'fp-ts/ReadonlySet'
import * as RA from 'fp-ts/ReadonlyArray'
import * as O from 'fp-ts/Option'
import * as IO from 'fp-ts/IO'
import * as N from 'fp-ts/number'

const cellFocusMode: () => DataGridCellFocusMode = constant('none')

const useClasses = makeStyles({
  card: {
    width: '100%',
    ...shorthands.margin(0, 'auto'),
    ...shorthands.padding(tokens.spacingHorizontalXXXL, '5%'),
  },
  columnHeader: {
    fontWeight: 'bold',
  },
})

type IndexedSeries = readonly (readonly [string, string])[]

interface Props {
  series: IndexedSeries
  title: string
}

export default function IncorrectDataGrid({ series, title }: Props) {
  const classes = useClasses()

  const dispatch = useAppDispatch()

  const flaggedRows = useAppSelector((state) =>
    getFilteredFlaggedRows(state, title, 'incorrect'),
  )

  const columnDefinition: TableColumnDefinition<readonly [string, string]>[] =
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
      pipe('', constant, O.getOrElse),
      (x) => [x, title, checkedIndex, 'incorrect'] as Flag,
    )

    return pipe(payload, syncFlaggedCells, (x) => dispatch(x), IO.of)()
  }

  return (
    <Card className={classes.card} size="large">
      <Title2>Incorrect Data</Title2>
      {series.length ? (
        <SimpleDataGrid
          onSelectionChange={handleSelectionChange}
          cellFocusMode={cellFocusMode}
          selectionMode="multiselect"
          selectedItems={flaggedRows}
          columns={columnDefinition}
          items={series}
        />
      ) : (
        <Body1>No incorrect data found</Body1>
      )}
    </Card>
  )
}
