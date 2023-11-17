/**
 * @file This file contains the flag data grid component.
 * @module pages/EDA/Variable/DataGrid/FlagDataGrid
 */

import type { FlagReason } from '@/lib/fp/Flag'
import type { TableColumnDefinition } from '@fluentui/react-components'

import SimpleDataGrid from '@/components/SimpleDataGrid'
import { getIndexedIndex } from '@/lib/array'
import { useAppSelector } from '@/lib/hooks'
import { useSyncedSelectionHandler } from '@/pages/EDA/Variable/DataGrid/hooks'
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
  series: readonly (readonly [string, number | string])[]
  subtitleText: string
  titleText: string
  visit: string
}

/**
 * The base data grid for flagging cells across various reasons.
 * @param props - The {@link Props props} for the component.
 * @param props.titleText - The data grid title.
 * @param props.subtitleText - The data grid subtitle.
 * @param props.emptyText - The text to display when there are no flagged cells.
 * @param props.series - The series to display.
 * @param props.reason - The reason for flagging.
 * @returns The component object.
 * @category Component
 * @example
 * ```tsx
 *  <FlagDataGrid
 *    titleText={titleText}
 *    subtitleText={subtitleText}
 *    emptyText={emptyText}
 *    series={series}
 *    reason={reason}
 * />
 */
export default function FlagDataGrid({
  emptyText,
  reason,
  series,
  subtitleText,
  titleText,
  ...props
}: Readonly<Props>) {
  const classes = useClasses()

  const title = useAppSelector(selectFormattedColumn(props))
  const flaggedRows = useAppSelector(selectFlaggedRows(title, reason))
  const handleSelectionChange = useSyncedSelectionHandler(reason, title, series)

  const columnDefinition: Readonly<
    TableColumnDefinition<readonly [string, number | string]>[]
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
