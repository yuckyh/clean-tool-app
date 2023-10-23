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
  getIndexedRowMissings as getIndexedRowBlanks,
  getFilteredFlaggedRows,
  getIndexedRow,
} from '@/features/sheet/selectors'
import { constant, identity, flow, pipe } from 'fp-ts/function'
import { getIndexedIndex, getIndexedValue, stringLookup } from '@/lib/array'
import type { FlagReason, Flag } from '@/features/sheet/reducers'
import { syncFlaggedCells } from '@/features/sheet/reducers'
import * as RS from 'fp-ts/ReadonlySet'
import * as RA from 'fp-ts/ReadonlyArray'
import * as O from 'fp-ts/Option'
import * as IO from 'fp-ts/IO'
import * as N from 'fp-ts/number'
import { strEquals } from '@/lib/string'

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

  const series = useAppSelector((state) =>
    getIndexedRowBlanks(state, column, visit),
  )
  const unfilteredSeries = useAppSelector((state) =>
    getIndexedRow(state, column, visit),
  )
  const flaggedRows = useAppSelector((state) =>
    getFilteredFlaggedRows(state, title, 'missing'),
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

  const indices = useMemo(() => pipe(series, RA.map(getIndexedIndex)), [series])
  const unfilteredIndices = useMemo(
    () => pipe(unfilteredSeries, RA.map(getIndexedIndex)),
    [unfilteredSeries],
  )

  const handleSelectionChange: DataGridProps['onSelectionChange'] = (
    _1,
    { selectedItems },
  ) => {
    const shouldAdd = flaggedRows.size < selectedItems.size

    const subtractor = (
      shouldAdd ? selectedItems : flaggedRows
    ) as ReadonlySet<number>

    const subtractee = (
      shouldAdd ? flaggedRows : selectedItems
    ) as ReadonlySet<number>

    const checkedPos = pipe(
      subtractor,
      RS.difference(N.Eq)(subtractee),
      RS.reduce(N.Ord)(0, N.MonoidSum.concat),
    )

    const currentIndex = stringLookup(indices)(checkedPos)

    const checkedUnfilteredPos = pipe(
      unfilteredIndices,
      pipe(currentIndex, strEquals, RA.findIndex),
      pipe(0, constant, O.getOrElse),
    )

    return pipe(
      [
        [checkedPos, 'missing'],
        [checkedUnfilteredPos, 'outlier'],
      ] as readonly (readonly [number, FlagReason])[],
      RA.map(
        flow(
          (x) => [currentIndex, title, ...x] as Flag,
          syncFlaggedCells,
          (x) => dispatch(x),
          IO.of,
        ),
      ),
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
