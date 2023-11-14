import type { AppState } from '@/app/store'
import type { TableColumnDefinition } from '@fluentui/react-components'

import SimpleDataGrid from '@/components/SimpleDataGrid'
import {
  getFormattedColumn,
  getSearchedPos,
} from '@/features/columns/selectors'
import { getFlaggedRows, getOutliers } from '@/features/sheet/selectors'
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
    getOutliers(state, column, visit)

/**
 *
 * @param title
 * @returns
 * @example
 */
const selectFlaggedRows = (title: string) => (state: AppState) =>
  getFlaggedRows(state, title, 'suspected')

/**
 *
 * @param props
 * @returns
 * @example
 */
export default function OutlierDataGrid(props: Readonly<Props>) {
  const classes = useClasses()

  const title = useAppSelector(selectTitle(props))
  const series = useAppSelector(selectSeries(props))
  const flaggedRows = useAppSelector(selectFlaggedRows(title))

  const columnDefinition: readonly TableColumnDefinition<
    readonly [string, number]
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
    'suspected',
    title,
    series,
  )

  return (
    <Card className={classes.card} size="large">
      <Title2>Suspected Outliers</Title2>
      <Body2>
        The data shown here are suspected outliers based on the bell curve
        distribution.
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
        <Body2>There are no suspected outliers.</Body2>
      )}
    </Card>
  )
}
