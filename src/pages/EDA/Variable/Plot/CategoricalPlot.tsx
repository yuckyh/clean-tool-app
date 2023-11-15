import type { AppState } from '@/app/store'
import type { Data, Layout } from 'plotly.js-cartesian-dist'

import { getIndexedValue, recordLookup } from '@/lib/array'
import { useAppSelector } from '@/lib/hooks'
import { getIndexedRow } from '@/selectors/data/rows'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'

import VariablePlot from '.'

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
  variable: string
  /**
   *
   */
  visit: string
}

const selectSeries =
  ({ column, visit }: Readonly<Props>) =>
  (state: AppState) =>
    getIndexedRow(state, column, visit)

/**
 *
 * @param props
 * @example
 */
export default function CategoricalPlot(props: Readonly<Props>) {
  const { variable } = props
  const series = useAppSelector(selectSeries(props))

  const count = f.pipe(
    series,
    RA.map(getIndexedValue),
    RA.reduce({} as Readonly<Record<string, number>>, (acc, curr) => ({
      ...acc,
      [curr]: recordLookup(acc)(0)(curr) + 1,
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
