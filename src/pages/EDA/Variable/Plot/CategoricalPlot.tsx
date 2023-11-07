import type { Data, Layout } from 'plotly.js-cartesian-dist'

import { getIndexedRow } from '@/features/sheet/selectors'
import { getIndexedValue } from '@/lib/array'
import { useAppSelector } from '@/lib/hooks'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'

import VariablePlot from '.'

interface Props {
  column: string
  variable: string
  visit: string
}

/**
 *
 * @param props
 * @param props.column
 * @param props.variable
 * @param props.visit
 * @example
 */
export default function CategoricalPlot({
  column,
  variable,
  visit,
}: Readonly<Props>) {
  const series = useAppSelector((state) => getIndexedRow(state, column, visit))

  const count = f.pipe(
    series,
    RA.map(getIndexedValue),
    RA.reduce({} as Readonly<Record<string, number>>, (acc, curr) => ({
      ...acc,
      [curr]: (acc[curr] ?? 0) + 1,
    })),
  )

  const maxCount = Math.max(...Object.values(count))

  const data: readonly Readonly<Partial<Data>>[] = [
    {
      type: 'bar',
      x: Object.keys(count),
      y: Object.values(count),
    },
  ]

  const layout: Readonly<Partial<Layout>> = {
    xaxis: {
      type: 'category',
    },
    yaxis: {
      range: [0, maxCount],
      tickformat: 'd',
      tickvals: RA.makeBy(maxCount + 1, f.identity) as number[],
      title: 'count',
    },
  }

  return <VariablePlot data={data} layout={layout} variable={variable} />
}
