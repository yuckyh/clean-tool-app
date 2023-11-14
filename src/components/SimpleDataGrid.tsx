/**
 * @file This file contains the simple data grid component.
 * @module components/SimpleDataGrid
 */

import type {
  DataGridBodyProps,
  DataGridProps,
  TableColumnDefinition,
  TableRowData,
} from '@fluentui/react-components'

import { createMemo } from '@/lib/utils'
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
  shorthands,
} from '@fluentui/react-components'
import { Suspense, useCallback, useMemo } from 'react'

import Loader from './Loader'

const MemoizedGrid = createMemo('MemoizedGrid', DataGrid)

const useClasses = makeStyles({
  cell: {
    minWidth: '160px',
    ...shorthands.padding(0),
  },
  container: {
    minWidth: 'fit-content',
    width: '100%',
  },
  grid: {
    overflowX: 'auto',
    width: '100%',
  },
  skeleton: {
    width: '100%',
  },
})

/**
 *
 */
export interface Props<T>
  extends Partial<Omit<DataGridProps, 'columns' | 'items'>> {
  /**
   *
   */
  columns: readonly TableColumnDefinition<T>[]
  /**
   *
   */
  items: readonly T[]
}

/**
 *
 * @param props
 * @param props.columns
 * @param props.items
 * @example
 */
export default function SimpleDataGrid<T>({
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
    ({ columnId, renderHeaderCell }: Readonly<TableColumnDefinition<T>>) => (
      <DataGridHeaderCell className={classes.cell} key={columnId}>
        {renderHeaderCell()}
      </DataGridHeaderCell>
    ),
    [classes.cell],
  )

  const renderCellFn = useCallback(
    ({ item, rowId }: Readonly<TableRowData<T>>) => (
      <DataGridRow key={rowId}>
        {({ columnId, renderCell }) => (
          <DataGridCell
            className={classes.cell}
            focusMode="none"
            key={columnId}>
            <Suspense
              fallback={
                <Skeleton className={classes.skeleton}>
                  <SkeletonItem size={40} />
                </Skeleton>
              }>
              {renderCell(item)}
            </Suspense>
          </DataGridCell>
        )}
      </DataGridRow>
    ),
    [classes.cell, classes.skeleton],
  )

  return (
    <Loader
      label={<Subtitle1>Loading Table...</Subtitle1>}
      labelPosition="below"
      size="huge">
      <MemoizedGrid
        {...props}
        className={classes.grid}
        columns={columns as TableColumnDefinition<T>[]}
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
