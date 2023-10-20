/* eslint-disable functional/immutable-data */
import type { DataGridCellFocusMode } from '@fluentui/react-components'
import { createTableColumn, Title2 } from '@fluentui/react-components'
import { useMemo } from 'react'
import type { Props as SimpleDataGridProps } from '@/components/SimpleDataGrid'

import { useAppSelector } from '@/lib/hooks'
import { createLazyMemo } from '@/lib/utils'

import { constant, identity } from 'fp-ts/function'
import * as RA from 'fp-ts/ReadonlyArray'
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

const items = RA.makeBy(5, identity)

const cellFocusMode: () => DataGridCellFocusMode = constant('none')

function PreviewDataGrid({ isOriginal = false }: Props) {
  const columnsLength = useAppSelector(getColumnsLength)

  const columnsDefinition = useMemo(
    () =>
      RA.makeBy(columnsLength, (pos) =>
        createTableColumn<number>({
          renderHeaderCell: constant(
            <PreviewHeaderCell isOriginal={isOriginal} pos={pos} />,
          ),
          renderCell: (row) => <MemoizedValueCell row={row} col={pos} />,
          columnId: `${pos}`,
        }),
      ),
    [columnsLength, isOriginal],
  )

  // useLoggerEffect({ columnsLength })

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
