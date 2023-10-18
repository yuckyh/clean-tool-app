import type {
  DataGridCellFocusMode,
  TableColumnDefinition,
} from '@fluentui/react-components'

import {
  createTableColumn,
  makeStyles,
  shorthands,
  Subtitle2,
  Title2,
  tokens,
  Card,
} from '@fluentui/react-components'
import { useMemo } from 'react'
import SimpleDataGrid from '@/components/SimpleDataGrid'
import { useAppSelector } from '@/lib/hooks'
import { getIndexedRowBlanks } from '@/features/sheet/selectors'
import { constant } from 'fp-ts/function'

const cellFocusMode: () => DataGridCellFocusMode = constant('none')

const useClasses = makeStyles({
  card: {
    width: '100%',
    ...shorthands.margin(0, 'auto'),
    ...shorthands.padding(tokens.spacingHorizontalXXXL, '5%'),
  },
  columnHeader: {
    fontWeight: 'bold',
  },
})

interface Props {
  column: string
  visit: string
}

function BlankDataGrid({ column, visit }: Props) {
  const classes = useClasses()

  const title = `${column}${visit && visit !== '1' ? `_${visit}` : ''}`

  const columnDefinition: TableColumnDefinition<readonly [string, string]>[] =
    useMemo(
      () => [
        createTableColumn({
          renderHeaderCell: constant(
            <div className={classes.columnHeader}>sno</div>,
          ),
          renderCell: ([, indexValue]) => indexValue,
          columnId: 'index',
        }),
        createTableColumn({
          renderHeaderCell: constant(
            <div className={classes.columnHeader}>{title}</div>,
          ),
          renderCell: ([seriesValue]) => seriesValue,
          columnId: title,
        }),
      ],
      [classes.columnHeader, title],
    )

  const series = useAppSelector((state) =>
    getIndexedRowBlanks(state, column, visit),
  )
  // console.log(numericalSeries)

  return (
    <Card className={classes.card} size="large">
      <Title2>Blank Data</Title2>
      <Subtitle2>Flag if the data is blank</Subtitle2>
      <SimpleDataGrid
        cellFocusMode={cellFocusMode}
        selectionMode="multiselect"
        // onSelectionChange={handleSelectionChange}
        columns={columnDefinition}
        // selectedItems={flaggedRows}
        items={series}
      />
    </Card>
  )
}

export default BlankDataGrid
