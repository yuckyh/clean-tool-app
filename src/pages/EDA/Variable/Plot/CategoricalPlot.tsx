/**
 * @file This file contains the categorical plot component.
 * @module pages/EDA/Variable/Plot/CategoricalPlot
 */

import type { Data, Layout } from 'plotly.js-cartesian-dist'

import { getIndexedValue, recordLookup } from '@/lib/array'
import { useAppSelector } from '@/lib/hooks'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'

import VariablePlot from '.'
import { selectCategoricalSeries } from '../selectors'

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

/**
 * The categorical plot component is used to create more complex plots.
 * @param props - The {@link Props props} for the component.
 * @returns The component object.
 * @category Component
 * @example
 * ```tsx
 *  <CategoricalPlot
 *    column="al_r"
 *    variable="al_r_1"
 *    visit="1" />
 * ```
 */
export default function CategoricalPlot(props: Readonly<Props>) {
  const { variable } = props
  const series = useAppSelector(selectCategoricalSeries(props))

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
