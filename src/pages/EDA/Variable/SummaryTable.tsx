import SimpleDataGrid from '@/components/SimpleDataGrid'
import { getIndexedValue } from '@/lib/array'
import type {
  DataGridCellFocusMode,
  TableColumnDefinition,
  TableColumnId,
} from '@fluentui/react-components'
import {
  createTableColumn,
  CardHeader,
  makeStyles,
  shorthands,
  Title1,
  tokens,
  Card,
} from '@fluentui/react-components'
import { constant } from 'fp-ts/function'
import { useMemo } from 'react'
import * as RA from 'fp-ts/ReadonlyArray'
import * as N from 'fp-ts/number'

interface SummaryStats {
  statistic: string
  value: number
}

interface Props {
  categoricalSeries: readonly (readonly [string, string])[]
  numericalSeries: readonly (readonly [string, number])[]
  isCategorical: boolean
}

const cellFocusMode: (tableColumnId: TableColumnId) => DataGridCellFocusMode =
  constant('none')

const useClasses = makeStyles({
  card: {
    height: '100%',
    width: '100%',
    ...shorthands.margin(0, 'auto'),
    ...shorthands.padding(tokens.spacingHorizontalXXXL, '5%'),
  },
})

// eslint-disable-next-line functional/functional-parameters
export default function SummaryTable({
  categoricalSeries,
  numericalSeries,
  isCategorical,
}: Props) {
  const classes = useClasses()
  const cleanValues = useMemo(
    () => RA.map(getIndexedValue)(numericalSeries),
    [numericalSeries],
  )

  const columnDefinition: TableColumnDefinition<SummaryStats>[] = useMemo(
    () => [
      createTableColumn({
        renderCell: ({ statistic }) => statistic,
        renderHeaderCell: constant('Statistic'),
        columnId: 'statistic',
      }),
      createTableColumn({
        renderHeaderCell: constant('Value'),
        renderCell: ({ value }) => value,
        columnId: 'value',
      }),
    ],
    [],
  )

  const dataSum = useMemo(
    () => RA.reduce(0, N.MonoidSum.concat)(cleanValues),
    [cleanValues],
  )

  const summaryStatistics: readonly SummaryStats[] = useMemo(
    () =>
      isCategorical
        ? [{ value: categoricalSeries.length, statistic: 'Count' }]
        : [
            { value: cleanValues.length, statistic: 'Count' },
            {
              value: Math.min(...cleanValues),
              statistic: 'Min',
            },
            {
              value: Math.max(...cleanValues),
              statistic: 'Max',
            },
            {
              value: dataSum / cleanValues.length,
              statistic: 'Mean',
            },
            {
              statistic: 'Sum',
              value: dataSum,
            },
          ],
    [isCategorical, categoricalSeries.length, cleanValues, dataSum],
  )
  return (
    <Card className={classes.card} size="large">
      <CardHeader header={<Title1>Summary Statistics</Title1>} />
      <SimpleDataGrid
        cellFocusMode={cellFocusMode}
        columns={columnDefinition}
        items={summaryStatistics}
      />
    </Card>
  )
}
