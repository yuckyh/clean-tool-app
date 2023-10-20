import type { Layout, Data } from 'plotly.js-cartesian-dist-min'

import * as RA from 'fp-ts/ReadonlyArray'
import { identity, pipe } from 'fp-ts/function'
import { getIndexedValue } from '@/lib/array'
import VariablePlot from './VariablePlot'

type IndexedSeries = readonly (readonly [string, string])[]

interface Props {
  series: IndexedSeries
  variable: string
}

export default function CategoricalPlot({ variable, series }: Props) {
  const count = pipe(
    series,
    RA.map(getIndexedValue),
    RA.reduce({} as Readonly<Record<string, number>>, (acc, curr) => ({
      ...acc,
      [curr]: (acc[curr] ?? 0) + 1,
    })),
  )

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
      tickvals: RA.makeBy(maxCount + 1, identity) as number[],
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
