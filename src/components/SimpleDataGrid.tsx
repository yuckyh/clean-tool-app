import type {
  DataGridCellFocusMode,
  DataGridProps,
  TableColumnDefinition,
  TableColumnId,
  TableRowData,
} from '@fluentui/react-components'

import {
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  makeStyles,
} from '@fluentui/react-components'
import { useCallback } from 'react'

interface SimpleDataGridProps<T, K>
  extends Partial<Omit<DataGridProps, 'columns' | 'items'>> {
  cellFocusMode: (columnId: TableColumnId) => DataGridCellFocusMode
  columns: TableColumnDefinition<K>[]
  items: T[]
}

const useClasses = makeStyles({
  cell: {
    minWidth: '160px',
  },
  container: {
    minWidth: 'fit-content',
    width: '100%',
  },
  grid: {
    overflowX: 'auto',
    width: '100%',
  },
})

const SimpleDataGrid: <T, K>(
  props: SimpleDataGridProps<T, K>,
) => JSX.Element = (props) => {
  const { cellFocusMode, items } = props
  const classes = useClasses()

  const renderHeaderCell: <K>(def: TableColumnDefinition<K>) => JSX.Element =
    useCallback(
      ({ renderHeaderCell }) => (
        <DataGridHeaderCell className={classes.cell}>
          {renderHeaderCell()}
        </DataGridHeaderCell>
      ),
      [classes.cell],
    )

  const renderCell: (def: TableRowData<(typeof items)[1]>) => JSX.Element =
    useCallback(
      ({ item, rowId }) => (
        <DataGridRow<(typeof items)[1]> key={rowId}>
          {({ columnId, renderCell }) => (
            <DataGridCell
              className={classes.cell}
              focusMode={cellFocusMode(columnId)}>
              {renderCell(item)}
            </DataGridCell>
          )}
        </DataGridRow>
      ),
      [cellFocusMode, classes.cell],
    )
  return (
    <DataGrid {...props} className={classes.grid}>
      <DataGridHeader className={classes.container}>
        <DataGridRow>{renderHeaderCell}</DataGridRow>
      </DataGridHeader>
      <DataGridBody<(typeof items)[1]> className={classes.container}>
        {renderCell}
      </DataGridBody>
    </DataGrid>
  )
}

export default SimpleDataGrid
