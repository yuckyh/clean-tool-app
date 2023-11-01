import type { TableColumnDefinition } from '@fluentui/react-components'

import SimpleDataGrid from '@/components/SimpleDataGrid'
import {
  getFormattedColumn,
  getSearchedPos,
} from '@/features/columns/selectors'
import {
  getFlaggedRows,
  getIndexedRowMissings as getIndexedRowBlanks,
} from '@/features/sheet/selectors'
import { getIndexedIndex } from '@/lib/array'
import { useAppSelector, useSyncedSelectionHandler } from '@/lib/hooks'
import {
  Body2,
  Card,
  Title2,
  createTableColumn,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import * as f from 'fp-ts/function'
import { useMemo } from 'react'

import ValueCell from './ValueCell'

const useClasses = makeStyles({
  card: {
    width: '100%',
    ...shorthands.margin(0, 'auto'),
    ...shorthands.padding(tokens.spacingHorizontalXXXL, '5%'),
  },
  columnHeader: {
    display: 'flex',
    fontWeight: 'bold',
    justifyContent: 'center',
    width: '100%',
    ...shorthands.padding(0, tokens.spacingHorizontalS),
  },
})

interface Props {
  column: string
  visit: string
}

export default function BlankDataGrid({ column, visit }: Props) {
  const classes = useClasses()

  const pos = useAppSelector((state) => getSearchedPos(state, column, visit))
  const title = useAppSelector((state) => getFormattedColumn(state, pos))

  const series = useAppSelector((state) =>
    getIndexedRowBlanks(state, column, visit),
  )
  const flaggedRows = useAppSelector((state) =>
    getFlaggedRows(state, title, 'missing'),
  )

  const columnDefinition: TableColumnDefinition<readonly [string, string]>[] =
    useMemo(
      () => [
        createTableColumn({
          columnId: 'index',
          renderCell: ([index]) => <ValueCell value={index} />,
          renderHeaderCell: f.constant(
            <div className={classes.columnHeader}>sno</div>,
          ),
        }),
        createTableColumn({
          columnId: title,
          renderCell: ([, value]) => <ValueCell value={value} />,
          renderHeaderCell: f.constant(
            <div className={classes.columnHeader}>{title}</div>,
          ),
        }),
      ],
      [classes.columnHeader, title],
    )

  const handleSelectionChange = useSyncedSelectionHandler(
    'missing',
    title,
    series,
  )

  return (
    <Card className={classes.card} size="large">
      <Title2>Blank Data</Title2>
      <Body2>
        The data shown here are the most common blank values that could be
        invalidly blank.
      </Body2>
      {series.length ? (
        <SimpleDataGrid
          columns={columnDefinition}
          getRowId={getIndexedIndex}
          items={series}
          onSelectionChange={handleSelectionChange}
          selectedItems={flaggedRows}
          selectionMode="multiselect"
        />
      ) : (
        <Body2>There are no blank data found</Body2>
      )}
    </Card>
  )
}
