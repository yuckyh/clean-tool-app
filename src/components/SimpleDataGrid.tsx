import type {
  DataGridCellFocusMode,
  DataGridProps,
  TableColumnDefinition,
  TableColumnId,
  TableRowData,
} from '@fluentui/react-components'
import {
  DataGrid,
  DataGridHeader,
  DataGridRow,
  DataGridHeaderCell,
  DataGridBody,
  DataGridCell,
  makeStyles,
} from '@fluentui/react-components'
import { useCallback } from 'react'

interface SimpleDataGridProps<T, K>
  extends Partial<Omit<DataGridProps, 'items' | 'columns'>> {
  items: T[]
  columns: TableColumnDefinition<K>[]
  cellFocusMode: (columnId: TableColumnId) => DataGridCellFocusMode
}

const useClasses = makeStyles({
  grid: {
    width: '100%',
    overflowX: 'auto',
  },
  container: {
    width: '100%',
    minWidth: 'fit-content',
  },
  cell: {
    minWidth: '160px',
  },
})

const SimpleDataGrid: <T, K>(
  props: SimpleDataGridProps<T, K>,
) => JSX.Element = (props) => {
  const { items, cellFocusMode } = props
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
          {({ renderCell, columnId }) => (
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
