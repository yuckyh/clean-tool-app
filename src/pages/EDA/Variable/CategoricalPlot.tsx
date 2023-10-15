import type { Layout, Data } from 'plotly.js-cartesian-dist-min'

import { reduce, values, range, keys } from 'lodash/fp'
import VariablePlot from './VariablePlot'

type IndexedSeries = (readonly [string, string])[]

interface Props {
  series: IndexedSeries
  variable: string
}

export default function CategoricalPlot({ variable, series }: Props) {
  const count = reduce<readonly [string, string], Record<string, number>>(
    (acc, [curr]) => {
      acc[curr] = (acc[curr] ?? 0) + 1
      return acc
    },
    {},
  )(series)

  const maxCount = Math.max(...values(count))

  const data: Partial<Data>[] = [
    {
      y: values(count),
      x: keys(count),
      type: 'bar',
    },
  ]

  const layout: Partial<Layout> = {
    yaxis: {
      tickvals: range(0)(maxCount + 1),
      range: [0, maxCount],
      tickformat: 'd',
      title: 'count',
    },
    xaxis: {
      type: 'category',
    },
  }

  return <VariablePlot variable={variable} layout={layout} data={data} />
}
