import type { Props as SimpleDataGridProps } from '@/components/SimpleDataGrid'

import {
  createTableColumn,
  makeStyles,
  tokens,
  Title2,
} from '@fluentui/react-components'
import { getFormattedColumn } from '@/features/columns/selectors'
import { useAppSelector } from '@/lib/hooks'
import { createLazyMemo } from '@/lib/utils'
import { useCallback, useMemo } from 'react'
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
    backgroundColor: tokens.colorPaletteBerryBackground2,
  },
  columnHeader: {
    fontWeight: 'bold',
  },
})

const PreviewDataGrid = ({ isOriginal = false }: Props) => {
  const columnsLength = useAppSelector(
    (state) => getColumns(state, true).length,
  )

  const columnsDefinition = useMemo(
    () =>
      range(columnsLength).map((pos) =>
        createTableColumn<number>({
          renderHeaderCell: () => (
            <PreviewHeaderCell isOriginal={isOriginal} pos={pos} />
          ),
          renderCell: (row) => <MemoizedValueCell row={row} col={pos} />,
          columnId: `${pos}`,
        }),
      ),
    [columnsLength, isOriginal],
  )

  const cellFocusMode = useCallback(() => 'none', [])

  const items = useMemo(() => range(5), [])

  return (
    <>
      <Title2>Data Preview</Title2>
      <MemoizedSimpleDataGrid
        cellFocusMode={cellFocusMode}
        columns={columnsDefinition}
        items={items}
      />
    </>
  )
}

interface PreviewHeaderCellProps {
  isOriginal: boolean
  pos: number
}

const PreviewHeaderCell = ({ isOriginal, pos }: PreviewHeaderCellProps) => {
  const classes = useClasses()

  const column = useAppSelector((state) =>
    isOriginal
      ? getColumn(state, isOriginal, pos)
      : getFormattedColumn(state, pos),
  )

  return <div className={classes.columnHeader}>{column}</div>
}

export default PreviewDataGrid
