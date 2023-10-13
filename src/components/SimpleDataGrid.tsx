import type {
  DataGridCellFocusMode,
  TableColumnDefinition,
  DataGridBodyProps,
  DataGridProps,
  TableColumnId,
  TableRowData,
} from '@fluentui/react-components'

import {
  DataGridHeaderCell,
  DataGridHeader,
  DataGridBody,
  DataGridCell,
  SkeletonItem,
  DataGridRow,
  makeStyles,
  Subtitle1,
  DataGrid,
  Skeleton,
} from '@fluentui/react-components'
import { useCallback, Suspense, useMemo, memo } from 'react'

import Loader from './Loader'

export interface Props<T>
  extends Partial<Omit<DataGridProps, 'columns' | 'items'>> {
  cellFocusMode: (columnId: TableColumnId) => DataGridCellFocusMode
  columns: TableColumnDefinition<T>[]
  items: T[]
}

const useClasses = makeStyles({
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
  cell: {
    minWidth: '160px',
  },
})

const MemoizedGrid = memo(DataGrid)
MemoizedGrid.displayName = 'MemoizedGrid'

export default function SimpleDataGrid<T>(props: Props<T>) {
  const { cellFocusMode } = props

  const classes = useClasses()

  const MemoizedGridBody = useMemo(() => {
    const component = memo<DataGridBodyProps<T>>(DataGridBody)
    component.displayName = 'MemoizedGridBody'
    return component
  }, [])

  const renderHeaderCellFn = useCallback(
    ({ renderHeaderCell, columnId }: TableColumnDefinition<T>) => (
      <DataGridHeaderCell className={classes.cell} key={columnId}>
        {renderHeaderCell()}
      </DataGridHeaderCell>
    ),
    [classes.cell],
  )

  const renderCellFn = useCallback(
    ({ rowId, item }: TableRowData<T>) => (
      <DataGridRow key={rowId}>
        {({ renderCell, columnId }) => (
          <DataGridCell
            focusMode={cellFocusMode(columnId)}
            className={classes.cell}
            key={columnId}>
            <Suspense
              fallback={
                <Skeleton className={classes.skeletonCell}>
                  <SkeletonItem size={40} />
                </Skeleton>
              }>
              {renderCell(item)}
            </Suspense>
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
      <MemoizedGrid {...props} className={classes.grid}>
        <DataGridHeader className={classes.container}>
          <DataGridRow>{renderHeaderCellFn}</DataGridRow>
        </DataGridHeader>
        <MemoizedGridBody className={classes.container}>
          {renderCellFn}
        </MemoizedGridBody>
      </MemoizedGrid>
    </Loader>
  )
}
