import type { Layout, Data } from 'plotly.js-cartesian-dist-min'

import { range } from '@/lib/array'

import VariablePlot from './VariablePlot'

type IndexedSeries = (readonly [string, string])[]

interface Props {
  series: IndexedSeries
  variable: string
}

export default function CategoricalPlot({ variable, series }: Props) {
  const count = series.reduce<Record<string, number>>((acc, [curr]) => {
    acc[curr] = (acc[curr] ?? 0) + 1
    return acc
  }, {})

  const maxCount = Math.max(...Object.values(count))

  const data: Partial<Data>[] = [
    {
      y: Object.values(count),
      x: Object.keys(count),
      type: 'bar',
    },
  ]

  const layout: Partial<Layout> = {
    yaxis: {
      tickvals: range(maxCount + 1, 0),
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
