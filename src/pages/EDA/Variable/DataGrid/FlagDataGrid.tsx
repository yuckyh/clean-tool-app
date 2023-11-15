import type { FlagReason } from '@/lib/fp/Flag'
import type { TableColumnDefinition } from '@fluentui/react-components'

import SimpleDataGrid from '@/components/SimpleDataGrid'
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
import { selectFlaggedRows, selectFormattedColumn } from './selectors'

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
  emptyText: string
  reason: FlagReason
  series: readonly (readonly [string, string])[]
  subtitleText: string
  titleText: string
  visit: string
}

/**
 *
 * @param props
 * @param props.titleText
 * @param props.subtitleText
 * @param props.emptyText
 * @param props.series
 * @example
 */
export default function IncorrectDataGrid({
  emptyText,
  series,
  subtitleText,
  titleText,
  ...props
}: Readonly<Props>) {
  const classes = useClasses()

  const title = useAppSelector(selectFormattedColumn(props))
  const reason: FlagReason = 'incorrect'
  const flaggedRows = useAppSelector(selectFlaggedRows(title, reason))
  const handleSelectionChange = useSyncedSelectionHandler(reason, title, series)

  const columnDefinition: Readonly<
    TableColumnDefinition<readonly [string, string]>[]
  > = useMemo(
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

  return (
    <Card className={classes.card} size="large">
      <Title2>{titleText}</Title2>
      <Body2>{subtitleText}</Body2>
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
        <Body2>{emptyText}</Body2>
      )}
    </Card>
  )
}
