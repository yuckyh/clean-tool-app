/* eslint-disable functional/immutable-data */
import type { Props as SimpleDataGridProps } from '@/components/SimpleDataGrid'
import type { DataGridCellFocusMode } from '@fluentui/react-components'

import { useAppSelector } from '@/lib/hooks'
import { createLazyMemo } from '@/lib/utils'
import {
  Tag,
  TagGroup,
  Title2,
  createTableColumn,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'
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

const items = RA.makeBy(5, f.identity)

const cellFocusMode: () => DataGridCellFocusMode = f.constant('none')

const useClasses = makeStyles({
  numericalTag: {
    backgroundColor: tokens.colorPaletteRedBackground2,
    color: tokens.colorPaletteRedForeground2,
  },
})

function PreviewDataGrid({ isOriginal = false }: Props) {
  const classes = useClasses()

  const columnsLength = useAppSelector(getColumnsLength)

  const columnsDefinition = useMemo(
    () =>
      RA.makeBy(columnsLength, (pos) =>
        createTableColumn<number>({
          columnId: `${pos}`,
          renderCell: (row) => <MemoizedValueCell col={pos} row={row} />,
          renderHeaderCell: f.constant(
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
        {!isOriginal && (
          <TagGroup aria-label="Legends" role="list">
            <Tag appearance="brand" role="listitem">
              Categorical Column
            </Tag>
            <Tag
              appearance="brand"
              className={classes.numericalTag}
              role="listitem">
              Numerical Column
            </Tag>
          </TagGroup>
        )}
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
