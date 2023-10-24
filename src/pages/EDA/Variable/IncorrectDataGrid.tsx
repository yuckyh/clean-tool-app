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
import {
  getIndexedRowIncorrects,
  getFlaggedRows,
} from '@/features/sheet/selectors'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { constant, pipe, flow } from 'fp-ts/function'
import { getIndexedIndex, getIndexedValue } from '@/lib/array'
import type { Flag } from '@/features/sheet/reducers'
import { syncFlaggedCells } from '@/features/sheet/reducers'
import * as RS from 'fp-ts/ReadonlySet'
import * as RA from 'fp-ts/ReadonlyArray'
import * as IO from 'fp-ts/IO'
import * as S from 'fp-ts/string'

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

export default function IncorrectDataGrid({ column, visit, title }: Props) {
  const classes = useClasses()

  const dispatch = useAppDispatch()

  const series = useAppSelector((state) =>
    getIndexedRowIncorrects(state, column, visit),
  )
  const flaggedRows = useAppSelector((state) =>
    getFlaggedRows(state, title, 'incorrect'),
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

  const indices = useMemo(() => RA.map(getIndexedIndex)(series), [series])

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
      RA.map((currentIndex) => [currentIndex, title, 'incorrect'] as Flag),
    )

    const unfilteredPayloads = pipe(
      checkedPosList,
      RA.map((currentIndex) => [currentIndex, title, 'general'] as Flag),
    )

    return pipe(
      [...payloads, ...unfilteredPayloads] as const,
      RA.map(flow(syncFlaggedCells, (x) => dispatch(x), IO.of)),
      IO.sequenceArray,
    )()
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
          getRowId={getIndexedIndex}
          items={series}
        />
      ) : (
        <Body1>No incorrect data found</Body1>
      )}
    </Card>
  )
}
