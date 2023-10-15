import type { DataGridCellFocusMode } from '@fluentui/react-components'
import { createTableColumn, Title2 } from '@fluentui/react-components'
import { useMemo } from 'react'
import { constant, range, flow, map } from 'lodash/fp'
import type { Props as SimpleDataGridProps } from '@/components/SimpleDataGrid'

import { useAppSelector } from '@/lib/hooks'
import { createLazyMemo } from '@/lib/utils'

import PreviewHeaderCell from './PreviewHeaderCell'
import { getColumnsLength } from '../selectors'

interface Props {
  isOriginal?: boolean
}

const MemoizedValueCell = createLazyMemo(
  'MemoizedValueCell',
  () => import('./PreviewValueCell'),
)

const MemoizedSimpleDataGrid = createLazyMemo<SimpleDataGridProps<number>>(
  'MemoizedSimpleDataGrid',
  () => import('@/components/SimpleDataGrid'),
)

const items = range(0)(5)

const cellFocusMode: () => DataGridCellFocusMode = constant('none')

function PreviewDataGrid({ isOriginal = false }: Props) {
  const columnsLength = useAppSelector(getColumnsLength)

  const columnsDefinition = useMemo(
    () =>
      flow(
        range(0),
        map((pos) =>
          createTableColumn<number>({
            renderHeaderCell: () => (
              <PreviewHeaderCell isOriginal={isOriginal} pos={pos} />
            ),
            renderCell: (row) => <MemoizedValueCell row={row} col={pos} />,
            columnId: `${pos}`,
          }),
        ),
      )(columnsLength),
    [columnsLength, isOriginal],
  )

  return (
    columnsLength > 0 && (
      <div>
        <Title2>Data Preview</Title2>
        <MemoizedSimpleDataGrid
          cellFocusMode={cellFocusMode}
          columns={columnsDefinition}
          items={items}
        />
      </div>
    )
  )
}

PreviewDataGrid.defaultProps = {
  isOriginal: false,
}

export default PreviewDataGrid
