import SimpleDataGrid from '@/components/SimpleDataGrid'
import { transpose } from '@/lib/array'
import { useAppSelector } from '@/lib/hooks'
import { just } from '@/lib/utils'
import { createTableColumn } from '@fluentui/react-components'
import { lazy, memo, useMemo } from 'react'

import { getData, getOriginalColumns } from '../features/sheetSlice'

interface Props {
  columns: string[]
  length?: number
}

const MemoizedValueCell = just(() => import('./Cells/ValueCell'))(lazy)(memo)()
MemoizedValueCell.displayName = 'MemoizedValueCell'

const PreviewDataGrid = ({ columns, length = 5 }: Props) => {
  const data = useAppSelector(getData)
  const originalColumns = useAppSelector(getOriginalColumns)

  const columnDefs = useMemo(
    () =>
      transpose<[string[], string[]]>([columns, originalColumns]).map(
        ([column, original]) =>
          createTableColumn<CellItem>({
            columnId: original,
            renderCell: (item) => (
              <MemoizedValueCell item={item} original={original} />
            ),
            renderHeaderCell: () => <>{column}</>,
          }),
      ),
    [columns, originalColumns],
  )

  return (
    <SimpleDataGrid
      cellFocusMode={() => 'none'}
      columns={columnDefs}
      items={data.slice(0, length)}
    />
  )
}

export default PreviewDataGrid
