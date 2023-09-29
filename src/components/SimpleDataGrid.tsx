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
  Skeleton,
  SkeletonItem,
  Subtitle1,
  makeStyles,
} from '@fluentui/react-components'
import { Suspense, useCallback } from 'react'

import Loader from './Loader'

interface Props<T, K>
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
  skeletonCell: {
    width: '100%',
  },
})

const SimpleDataGrid = <T, K>(props: Props<T, K>) => {
  const { cellFocusMode } = props
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

  const renderCell: (def: TableRowData<T>) => JSX.Element = useCallback(
    ({ item, rowId }) => (
      <DataGridRow key={rowId}>
        {({ columnId, renderCell }) => (
          <DataGridCell
            className={classes.cell}
            focusMode={cellFocusMode(columnId)}
            key={columnId}>
            {
              <Suspense
                fallback={
                  <Skeleton className={classes.skeletonCell}>
                    <SkeletonItem size={40} />
                  </Skeleton>
                }>
                {renderCell(item)}
              </Suspense>
            }
          </DataGridCell>
        )}
      </DataGridRow>
    ),
    [cellFocusMode, classes.cell, classes.skeletonCell],
  )
  return (
    <Loader
      label={<Subtitle1>Loading Table...</Subtitle1>}
      labelPosition="below"
      size="huge">
      <DataGrid {...props} className={classes.grid}>
        <DataGridHeader className={classes.container}>
          <DataGridRow>{renderHeaderCell}</DataGridRow>
        </DataGridHeader>
        <DataGridBody className={classes.container}>{renderCell}</DataGridBody>
      </DataGrid>
    </Loader>
  )
}

export default SimpleDataGrid
