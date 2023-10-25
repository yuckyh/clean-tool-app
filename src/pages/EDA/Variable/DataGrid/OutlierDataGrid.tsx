import type {
  DataGridCellFocusMode,
  TableColumnDefinition,
} from '@fluentui/react-components'

import SimpleDataGrid from '@/components/SimpleDataGrid'
import {
  getFlaggedRows,
  getIndexedRowIncorrects,
} from '@/features/sheet/selectors'
import { getIndexedIndex, getIndexedValue } from '@/lib/array'
import { useAppSelector, useSyncedSelectionHandler } from '@/lib/hooks'
import {
  Body1,
  Card,
  Title2,
  createTableColumn,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import * as f from 'fp-ts/function'
import { useMemo } from 'react'

const cellFocusMode: () => DataGridCellFocusMode = f.constant('none')

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
  title: string
  visit: string
}

export default function OutlierDataGrid({ column, title, visit }: Props) {
  const classes = useClasses()

  const series = useAppSelector((state) =>
    getIndexedRowIncorrects(state, column, visit),
  )
  const flaggedRows = useAppSelector((state) =>
    getFlaggedRows(state, title, 'suspected'),
  )

  const columnDefinition: TableColumnDefinition<readonly [string, string]>[] =
    useMemo(
      () => [
        createTableColumn({
          columnId: 'index',
          renderCell: getIndexedIndex,
          renderHeaderCell: f.constant(
            <div className={classes.columnHeader}>sno</div>,
          ),
        }),
        createTableColumn({
          columnId: title,
          renderCell: getIndexedValue,
          renderHeaderCell: f.constant(
            <div className={classes.columnHeader}>{title}</div>,
          ),
        }),
      ],
      [classes.columnHeader, title],
    )

  const handleSelectionChange = useSyncedSelectionHandler(
    'suspected',
    title,
    column,
    visit,
  )

  return (
    <Card className={classes.card} size="large">
      <Title2>Incorrect Data</Title2>
      {series.length ? (
        <SimpleDataGrid
          cellFocusMode={cellFocusMode}
          columns={columnDefinition}
          getRowId={getIndexedIndex}
          items={series}
          onSelectionChange={handleSelectionChange}
          selectedItems={flaggedRows}
          selectionMode="multiselect"
        />
      ) : (
        <Body1>No incorrect data found</Body1>
      )}
    </Card>
  )
}
