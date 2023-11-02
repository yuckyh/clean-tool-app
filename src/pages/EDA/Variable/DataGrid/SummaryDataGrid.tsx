import type { TableColumnDefinition } from '@fluentui/react-components'

import SimpleDataGrid from '@/components/SimpleDataGrid'
import {
  getIndexedNumericalRow,
  getIndexedRow,
} from '@/features/sheet/selectors'
import { getIndexedValue, lookup } from '@/lib/array'
import { useAppSelector } from '@/lib/hooks'
import { add, divideBy } from '@/lib/number'
import {
  Card,
  CardHeader,
  Title1,
  createTableColumn,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'
import * as N from 'fp-ts/number'
import { useMemo } from 'react'

interface SummaryStats {
  statistic: string
  value: string
}

const useClasses = makeStyles({
  card: {
    height: '100%',
    width: '100%',
    ...shorthands.margin(0, 'auto'),
    ...shorthands.padding(tokens.spacingHorizontalXXXL, '5%'),
  },
})

export interface Props {
  column: string
  isCategorical: boolean
  visit: string
}

export default function SummaryDataGrid({
  column,
  isCategorical,
  visit,
}: Props) {
  const classes = useClasses()

  const categoricalSeries = useAppSelector((state) =>
    getIndexedRow(state, column, visit),
  )
  const numericalSeries = useAppSelector((state) =>
    getIndexedNumericalRow(state, column, visit),
  )

  const numericalValues = useMemo(
    () => RA.map(getIndexedValue)(numericalSeries),
    [numericalSeries],
  )

  const columnDefinition: TableColumnDefinition<SummaryStats>[] = useMemo(
    () => [
      createTableColumn({
        columnId: 'statistic',
        renderCell: ({ statistic }) => statistic,
        renderHeaderCell: f.constant('Statistic'),
      }),
      createTableColumn({
        columnId: 'value',
        renderCell: ({ value }) => value,
        renderHeaderCell: f.constant('Value'),
      }),
    ],
    [],
  )

  const dataSum = useMemo(
    () => RA.reduce(0, N.MonoidSum.concat)(numericalValues),
    [numericalValues],
  )

  const dataMean = useMemo(
    () => dataSum / numericalValues.length,
    [dataSum, numericalValues.length],
  )

  const dataMedian = useMemo(
    () =>
      f.pipe(numericalValues, RA.sort(N.Ord), (values) =>
        lookup(values)(0)(Math.floor(values.length / 2)),
      ),
    [numericalValues],
  )

  const dataStd = useMemo(
    () =>
      f.pipe(
        numericalValues,
        RA.map(f.flow(add(-1 * dataMean), (x) => x * x)),
        RA.reduce(0, N.MonoidSum.concat),
        f.flip(divideBy)(numericalValues.length),
        Math.sqrt,
      ),
    [dataMean, numericalValues],
  )

  const summaryStatistics: readonly SummaryStats[] = useMemo(
    () =>
      f.pipe(
        isCategorical
          ? [{ statistic: 'count', value: categoricalSeries.length }]
          : [
              { statistic: 'count', value: numericalValues.length },
              {
                statistic: 'min',
                value: Math.min(...numericalValues),
              },
              {
                statistic: 'max',
                value: Math.max(...numericalValues),
              },
              {
                statistic: 'median',
                value: dataMedian,
              },
              {
                statistic: 'mean',
                value: dataMean,
              },
              { statistic: 'Standard Deviation', value: dataStd },
            ],
        RA.map(({ statistic, value }) => ({
          statistic: statistic.replace(/^./g, (c) => c.toUpperCase()),
          value: value.toFixed(2),
        })),
      ),
    [
      isCategorical,
      categoricalSeries.length,
      numericalValues,
      dataMean,
      dataStd,
    ],
  )
  return (
    <Card className={classes.card} size="large">
      <CardHeader header={<Title1>Summary Statistics</Title1>} />
      <SimpleDataGrid columns={columnDefinition} items={summaryStatistics} />
    </Card>
  )
}
