import type { Props as SimpleDataGridProps } from '@/components/SimpleDataGrid'

import {
  createTableColumn,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import { getFormattedColumns } from '@/features/columns/selectors'
import { useAppSelector } from '@/lib/hooks'
import { useCallback, useMemo } from 'react'
import { createLazyMemo } from '@/lib/utils'

import { getPreviewData, getColumns } from '../selectors'

interface Props {
  isOriginal?: boolean
}

const MemoizedValueCell = createLazyMemo(
  'MemoizedValueCell',
  () => import('@/components/Cells/ValueCell'),
)

const MemoizedSimpleDataGrid = createLazyMemo<SimpleDataGridProps<CellItem>>(
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

const PreviewDataGrid = ({ isOriginal = false }: Props) => {
  const classes = useClasses()

  const columns = useAppSelector(
    isOriginal ? (state) => getColumns(state) : getFormattedColumns,
  )

  const previewData = useAppSelector((state) => getPreviewData(state))

  const columnsDefinition = useMemo(
    () =>
      columns.map((column, pos) =>
        createTableColumn<CellItem>({
          renderHeaderCell: () => (
            <div className={classes.columnHeader}>{column}</div>
          ),
          renderCell: (item) => <MemoizedValueCell item={item} pos={pos} />,
          columnId: column,
        }),
      ),
    [classes.columnHeader, columns],
  )

  const cellFocusMode = useCallback(() => 'none', [])

  return (
    <MemoizedSimpleDataGrid
      cellFocusMode={cellFocusMode}
      columns={columnsDefinition}
      items={previewData}
    />
  )
}

export default PreviewDataGrid
