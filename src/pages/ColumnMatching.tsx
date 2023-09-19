import ColumnsDataGrid from '@/components/ColumnsDataGrid'
import SimpleDataGrid from '@/components/SimpleDataGrid'
import { useAppSelector } from '@/lib/hooks'
import {
  Title1,
  createTableColumn,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import { useMemo } from 'react'
import { utils } from 'xlsx'

const useClasses = makeStyles({
  root: {
    display: 'grid',
    width: '70%',
    ...shorthands.margin(0, 'auto'),
    ...shorthands.gap(0, tokens.spacingVerticalS),
  },
})

type CellItem = Record<Column, boolean | number | string>
type Column = number | string

export const Component = () => {
  const classes = useClasses()

  const { sheet } = useAppSelector(({ sheet }) => sheet)
  const { formattedColumns, originalColumns } = useAppSelector(
    ({ columns }) => columns,
  )

  const data = useMemo(
    () => (sheet ? utils.sheet_to_json(sheet) : [[]]),
    [sheet],
  )

  const columnItems = useMemo(
    () =>
      formattedColumns.map((column, i) =>
        createTableColumn<CellItem>({
          columnId: column,
          renderCell: (item) => <>{item[originalColumns[i] ?? '']}</>,
          renderHeaderCell: () => <>{column}</>,
        }),
      ),
    [formattedColumns, originalColumns],
  )

  return (
    <section className={classes.root}>
      <Title1>Column Matching</Title1>

      <ColumnsDataGrid />
      <SimpleDataGrid
        cellFocusMode={() => 'none'}
        columns={columnItems}
        items={data.slice(1, 6)}
      />
    </section>
  )
}

Component.displayName = 'ColumnMatching'
