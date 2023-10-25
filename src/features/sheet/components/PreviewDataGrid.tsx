/* eslint-disable functional/immutable-data */
import type { Props as SimpleDataGridProps } from '@/components/SimpleDataGrid'
import type { DataGridCellFocusMode } from '@fluentui/react-components'

import { useAppSelector } from '@/lib/hooks'
import { createLazyMemo } from '@/lib/utils'
import { Title2, createTableColumn } from '@fluentui/react-components'
import * as RA from 'fp-ts/ReadonlyArray'
import { constant, identity } from 'fp-ts/function'
import { useMemo } from 'react'

import { getColumnsLength } from '../selectors'
import HeaderCell from './HeaderCell'

interface Props {
  isOriginal?: boolean
}

const MemoizedValueCell = createLazyMemo(
  'MemoizedValueCell',
  () => import('./ValueCell'),
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
          columnId: `${pos}`,
          renderCell: (row) => <MemoizedValueCell col={pos} row={row} />,
          renderHeaderCell: constant(
            <HeaderCell isOriginal={isOriginal} pos={pos} />,
          ),
        }),
      ),
    [columnsLength, isOriginal],
  )

  return (
    columnsLength > 0 && (
      <>
        <Title2>Data Preview</Title2>
        <MemoizedSimpleDataGrid
          cellFocusMode={cellFocusMode}
          columns={columnsDefinition}
          items={items}
        />
      </>
    )
  )
}

PreviewDataGrid.defaultProps = {
  isOriginal: false,
}

export default PreviewDataGrid
