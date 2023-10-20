import type {
  DataGridCellFocusMode,
  TableColumnDefinition,
  DataGridProps,
} from '@fluentui/react-components'

import {
  createTableColumn,
  makeStyles,
  shorthands,
  Subtitle2,
  Title2,
  tokens,
  Card,
} from '@fluentui/react-components'
import { useMemo } from 'react'
import SimpleDataGrid from '@/components/SimpleDataGrid'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
  getFilteredFlaggedRows,
  getFlaggedRows,
  getIndexedRow,
  getRowBlanks,
} from '@/features/sheet/selectors'
import { constant, identity, flip, flow, pipe } from 'fp-ts/function'
import { getIndexedIndex, getIndexedValue, stringLookup } from '@/lib/array'
import type { Flag } from '@/features/sheet/reducers'
import { syncFlaggedCells } from '@/features/sheet/reducers'
import * as RS from 'fp-ts/ReadonlySet'
import * as RA from 'fp-ts/ReadonlyArray'
import * as O from 'fp-ts/Option'
import * as IO from 'fp-ts/IO'
import * as N from 'fp-ts/number'
import { dumpTrace } from '@/lib/logger'

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

interface Props {
  column: string
  visit: string
  title: string
}

function BlankDataGrid({ column, visit, title }: Props) {
  const classes = useClasses()

  const dispatch = useAppDispatch()

  const series = useAppSelector((state) => getRowBlanks(state, column, visit))
  const allSeries = useAppSelector((state) =>
    getIndexedRow(state, column, visit),
  )
  const flaggedRows = useAppSelector((state) =>
    getFilteredFlaggedRows(state, title, 'missing'),
  )
  const allFlaggedRows = useAppSelector((state) => getFlaggedRows(state, title))

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
      allFlaggedRows.size < selectedItems.size ? selectedItems : allFlaggedRows

    const subtractee =
      allFlaggedRows.size < selectedItems.size ? allFlaggedRows : selectedItems

    const checkedIndex = pipe(
      subtractor as Readonly<Set<string>>,
      RS.map(N.Eq)(parseInt),
      RS.difference(N.Eq)(
        RS.map(N.Eq)(parseInt)(subtractee as Readonly<Set<string>>),
      ),
      RS.reduce(N.Ord)(0, N.MonoidSum.concat),
    )

    const checkedIndexForAll = pipe(
      allSeries,
      RA.map(getIndexedIndex),
      RA.findIndex(
        (allIndex) =>
          allIndex ===
          stringLookup(pipe(series, RA.map(getIndexedIndex)))(checkedIndex),
      ),
      O.getOrElse(constant(0)),
    )

    const payloadForAll = pipe(
      series,
      RA.map(getIndexedIndex),
      flip(stringLookup)(checkedIndex),
      (x) => [x, title, checkedIndex, 'missing'] as Flag,
      dumpTrace,
    )

    const payload = pipe(
      series,
      RA.map(getIndexedIndex),
      flip(stringLookup)(checkedIndex),
      (x) => [x, title, checkedIndexForAll, 'outlier'] as Flag,
      dumpTrace,
    )

    return pipe(
      [payloadForAll, payload],
      RA.map(flow(syncFlaggedCells, (x) => dispatch(x), IO.of)),
      IO.traverseArray(identity),
    )()
  }

  return (
    <Card className={classes.card} size="large">
      <Title2>Blank Data</Title2>
      <Subtitle2>Flag if the data is blank</Subtitle2>
      <SimpleDataGrid
        onSelectionChange={handleSelectionChange}
        cellFocusMode={cellFocusMode}
        selectionMode="multiselect"
        selectedItems={flaggedRows}
        columns={columnDefinition}
        items={series}
        // getRowId={}
      />
    </Card>
  )
}

export default BlankDataGrid
