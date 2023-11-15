/**
 * @file This file contains the MissingDataGrid component.
 * @module pages/EDA/Variable/DataGrid/MissingDataGrid
 */
import type { AppState } from '@/app/store'
import type { TableColumnDefinition } from '@fluentui/react-components'

import SimpleDataGrid from '@/components/SimpleDataGrid'
import { getIndexedIndex } from '@/lib/array'
import { useAppSelector, useSyncedSelectionHandler } from '@/lib/hooks'
import { getFlaggedRows, getIndexedRowMissings } from '@/selectors/data/rows'
import { getSearchedPos } from '@/selectors/matches'
import { getFormattedColumn } from '@/selectors/matches/format'
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

/**
 *
 */
interface Props {
  /**
   *
   */
  column: string
  /**
   *
   */
  visit: string
}

/**
 *
 * @param props
 * @param props.column
 * @param props.visit
 * @returns
 * @example
 */
const selectTitle =
  ({ column, visit }: Readonly<Props>) =>
  (state: AppState) =>
    getFormattedColumn(state, getSearchedPos(state, column, visit))

/**
 *
 * @param props
 * @param props.column
 * @param props.visit
 * @returns
 * @example
 */
const selectSeries =
  ({ column, visit }: Readonly<Props>) =>
  (state: AppState) =>
    getIndexedRowMissings(state, column, visit)

/**
 *
 * @param title
 * @returns
 * @example
 */
const selectFlaggedRows = (title: string) => (state: AppState) =>
  getFlaggedRows(state, title, 'missing')

/**
 * This function renders a data grid for the missing data.
 * @param props - The {@link Props props} object.
 * @returns The component object.
 * @example
 * ```tsx
 *  <MissingDataGrid
 *    column={column}
 *    visit={visit}
 *  />
 * ```
 */
export default function BlankDataGrid(props: Readonly<Props>) {
  const classes = useClasses()

  const title = useAppSelector(selectTitle(props))
  const series = useAppSelector(selectSeries(props))
  const flaggedRows = useAppSelector(selectFlaggedRows(title))

  const columnDefinition: readonly TableColumnDefinition<
    readonly [string, string]
  >[] = useMemo(
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
