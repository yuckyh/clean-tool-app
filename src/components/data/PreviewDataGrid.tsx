/**
 * @file This file contains the preview data grid component.
 */

/* eslint-disable
  functional/immutable-data
*/

import type { Props as SimpleDataGridProps } from '@/components/SimpleDataGrid'

import { useAppSelector } from '@/lib/hooks'
import { createLazyMemo } from '@/lib/utils'
import { getColumnsLength } from '@/selectors/data/columns'
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

import HeaderCell from './HeaderCell'

const MemoizedValueCell = createLazyMemo(
  'MemoizedValueCell',
  import('./ValueCell'),
)

const MemoizedSimpleDataGrid = createLazyMemo<SimpleDataGridProps<number>>(
  'MemoizedSimpleDataGrid',
  import('@/components/SimpleDataGrid'),
)

const items = RA.makeBy(5, f.identity)

const useClasses = makeStyles({
  numericalTag: {
    backgroundColor: tokens.colorPaletteRedBackground2,
    color: tokens.colorPaletteRedForeground2,
  },
})

/**
 * The props for {@link PreviewDataGrid}.
 */
interface Props {
  /**
   *
   */
  isOriginal?: boolean
}

/**
 * The data grid for previewing data.
 * @param props - The {@link Props props} for the component.
 * @param props.isOriginal - Whether the data grid is for the original data.
 * @returns The component object.
 * @example
 * ```tsx
 *  <PreviewDataGrid isOriginal={isOriginal} />
 *  ```
 */
function PreviewDataGrid({ isOriginal = false }: Readonly<Props>) {
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
        <MemoizedSimpleDataGrid columns={columnsDefinition} items={items} />
      </>
    )
  )
}

PreviewDataGrid.defaultProps = {
  isOriginal: false,
}

export default PreviewDataGrid
