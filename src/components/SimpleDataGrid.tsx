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
import { useCallback, Suspense, useMemo } from 'react'

import { createMemo } from '@/lib/utils'
import Loader from './Loader'

export interface Props<T>
  extends Partial<Omit<DataGridProps, 'columns' | 'items'>> {
  cellFocusMode: (columnId: TableColumnId) => DataGridCellFocusMode
  columns: readonly TableColumnDefinition<T>[]
  items: readonly T[]
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

const MemoizedGrid = createMemo('MemoizedGrid', DataGrid)

export default function SimpleDataGrid<T>({
  cellFocusMode,
  columns,
  items,
  ...props
}: Readonly<Props<T>>) {
  const classes = useClasses()

  const MemoizedGridBody = useMemo(
    () => createMemo<DataGridBodyProps<T>>('MemoizedGridBody', DataGridBody),
    [],
  )

  const renderHeaderCellFn = useCallback(
    ({ renderHeaderCell, columnId }: Readonly<TableColumnDefinition<T>>) => (
      <DataGridHeaderCell className={classes.cell} key={columnId}>
        {renderHeaderCell()}
      </DataGridHeaderCell>
    ),
    [classes.cell],
  )

  const renderCellFn = useCallback(
    ({ rowId, item }: Readonly<TableRowData<T>>) => (
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
      <MemoizedGrid
        {...props}
        columns={columns as TableColumnDefinition<T>[]}
        className={classes.grid}
        items={items as T[]}>
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
