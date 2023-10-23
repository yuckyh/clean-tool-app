/* eslint-disable import/prefer-default-export */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/functional-parameters */

import { getFormattedColumns } from '@/features/columns/selectors'
import { useAppSelector } from '@/lib/hooks'
import type { TableColumnDefinition } from '@fluentui/react-components'
import { createTableColumn } from '@fluentui/react-components'
import { constant, identity } from 'fp-ts/function'
import { useMemo } from 'react'
import * as RA from 'fp-ts/ReadonlyArray'
import { getColumnsLength } from '@/features/sheet/selectors'
import { stringLookup } from '@/lib/array'
import SimpleDataGrid from '@/components/SimpleDataGrid'
import PreviewCell from './PreviewCell'

export function Component() {
  const dataLength = useAppSelector(({ sheet }) => sheet.data.length)
  const columnsLength = useAppSelector(getColumnsLength)
  const formattedColumns = useAppSelector(getFormattedColumns)

  const items = useMemo(() => RA.makeBy(dataLength, identity), [dataLength])
  const columnDefinitions: readonly TableColumnDefinition<number>[] = useMemo(
    () =>
      RA.makeBy(columnsLength, (col) =>
        createTableColumn({
          renderHeaderCell: () => stringLookup(formattedColumns)(col),
          renderCell: (row) => <PreviewCell col={col} row={row} />,
          columnId: stringLookup(formattedColumns)(col),
        }),
      ),
    [columnsLength, formattedColumns],
  )

  return (
    <section>
      <SimpleDataGrid
        cellFocusMode={constant('none')}
        columns={columnDefinitions}
        items={items}
      />
    </section>
  )
}
