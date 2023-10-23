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
import { constant, pipe } from 'fp-ts/function'
import { useMemo } from 'react'
import * as RA from 'fp-ts/ReadonlyArray'
import * as N from 'fp-ts/number'
import { getCleanNumericalRow, getIndexedRow } from '@/features/sheet/selectors'
import { useAppSelector } from '@/lib/hooks'

interface SummaryStats {
  statistic: string
  value: string
}

interface Props {
  isCategorical: boolean
  column: string
  visit: string
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
export default function SummaryTable({ isCategorical, column, visit }: Props) {
  const classes = useClasses()

  const categoricalSeries = useAppSelector((state) =>
    getIndexedRow(state, column, visit),
  )
  const numericalSeries = useAppSelector((state) =>
    getCleanNumericalRow(state, column, visit),
  )

  const numericalValues = useMemo(
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
    () => RA.reduce(0, N.MonoidSum.concat)(numericalValues),
    [numericalValues],
  )

  const summaryStatistics: readonly SummaryStats[] = useMemo(
    () =>
      pipe(
        isCategorical
          ? [{ value: categoricalSeries.length, statistic: 'count' }]
          : [
              { value: numericalValues.length, statistic: 'count' },
              {
                value: Math.min(...numericalValues),
                statistic: 'min',
              },
              {
                value: Math.max(...numericalValues),
                statistic: 'max',
              },
              {
                value: dataSum / numericalValues.length,
                statistic: 'mean',
              },
              {
                statistic: 'sum',
                value: dataSum,
              },
            ],
        RA.map(({ statistic, value }) => ({
          statistic: statistic.replace(/^./g, (c) => c.toUpperCase()),
          value: value.toFixed(2),
        })),
      ),
    [isCategorical, categoricalSeries.length, numericalValues, dataSum],
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
