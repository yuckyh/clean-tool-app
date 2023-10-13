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
  Body1,
  Card,
} from '@fluentui/react-components'
import { useMemo } from 'react'
import SimpleDataGrid from '@/components/SimpleDataGrid'
import { getRowIncorrects } from '@/features/sheet/selectors'
import { useAppSelector } from '@/lib/hooks'

const cellFocusMode: () => DataGridCellFocusMode = () => 'none'

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

export default function IncorrectDataGrid({ column, visit }: Props) {
  const classes = useClasses()

  const title = `${column}${visit && visit !== '1' ? `_${visit}` : ''}`

  const series = useAppSelector((state) =>
    getRowIncorrects(state, column, visit),
  )

  const columnDefinition: TableColumnDefinition<readonly [string, string]>[] =
    useMemo(
      () => [
        createTableColumn({
          renderHeaderCell: () => (
            <div className={classes.columnHeader}>sno</div>
          ),
          renderCell: ([, indexValue]) => indexValue,
          columnId: 'index',
        }),
        createTableColumn({
          renderHeaderCell: () => (
            <div className={classes.columnHeader}>{title}</div>
          ),
          renderCell: ([seriesValue]) => seriesValue,
          columnId: title,
        }),
      ],
      [classes.columnHeader, title],
    )

  return (
    <Card className={classes.card} size="large">
      <Title2>Incorrect Data</Title2>
      {series.length ? (
        <SimpleDataGrid
          cellFocusMode={cellFocusMode}
          selectionMode="multiselect"
          // onSelectionChange={handleSelectionChange}
          columns={columnDefinition}
          // selectedItems={flaggedRows}
          items={series}
        />
      ) : (
        <Body1>No incorrect data found</Body1>
      )}
    </Card>
  )
}
