import type { Props as SimpleDataGridProps } from '@/components/SimpleDataGrid'

import {
  createTableColumn,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import { useCallback, useMemo, memo } from 'react'
import { useAppSelector } from '@/lib/hooks'
import { createLazyMemo } from '@/lib/utils'
import { range } from '@/lib/array'

import { getColumns, getColumn } from '../selectors'

interface Props {
  isOriginal?: boolean
}

const MemoizedValueCell = createLazyMemo(
  'MemoizedValueCell',
  () => import('@/components/Cells/ValueCell'),
)

const MemoizedSimpleDataGrid = createLazyMemo<SimpleDataGridProps<number>>(
  'MemoizedSimpleDataGrid',
  () => import('@/components/SimpleDataGrid'),
)

const useClasses = makeStyles({
  categoricalHeader: {
    backgroundColor: tokens.colorPalettePurpleBackground2,
  },
  numericalHeader: {
    backgroundColor: tokens.colorPaletteBlueBackground2,
  },
  columnHeader: {
    fontWeight: 'bold',
  },
})

interface PreviewHeaderCellProps {
  isOriginal: boolean
  col: number
}

const PreviewHeaderCell = ({ isOriginal, col }: PreviewHeaderCellProps) => {
  const classes = useClasses()

  const column = useAppSelector((state) => getColumn(state, isOriginal, col))

  return <div className={classes.columnHeader}>{column}</div>
}

const MemoizedHeaderCell = memo(PreviewHeaderCell)
MemoizedHeaderCell.displayName = 'MemoizedHeaderCell'

const PreviewDataGrid = ({ isOriginal = false }: Props) => {
  const columnsLength = useAppSelector((state) => getColumns(state).length)

  const columnsDefinition = useMemo(
    () =>
      range(columnsLength).map((column, col) =>
        createTableColumn<number>({
          renderHeaderCell: () => (
            <MemoizedHeaderCell isOriginal={isOriginal} col={col} />
          ),
          renderCell: (row) => <MemoizedValueCell row={row} col={col} />,
          columnId: column,
        }),
      ),
    [columnsLength, isOriginal],
  )

  const cellFocusMode = useCallback(() => 'none', [])

  return (
    <MemoizedSimpleDataGrid
      cellFocusMode={cellFocusMode}
      columns={columnsDefinition}
      items={range(5)}
    />
  )
}

export default PreviewDataGrid
