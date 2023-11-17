/**
 * @file This file contains the variable plot component.
 * @module pages/EDA/Variable/Plot
 */

import type { Data, Layout } from 'plotly.js-cartesian-dist'

import Plot from '@/components/Plot'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'
import { useMemo } from 'react'

/**
 *
 */
interface Props {
  /**
   *
   */
  data: readonly Partial<Data>[]
  /**
   *
   */
  layout: Partial<Layout>
  /**
   *
   */
  variable: string
}

/**
 * The variable plot component is used to create more complex plots.
 * @param props - The {@link Props props} for the component.
 * @param props.data - The data for the plot.
 * @param props.layout - The layout for the plot.
 * @param props.variable - The variable name for the plot.
 * @returns The component object.
 * @example
 * ```tsx
 *  <VariablePlot
 *    data={data}
 *    layout={layout}
 *    variable={variable} />
 * ```
 */
export default function VariablePlot({
  data,
  layout,
  variable,
}: Readonly<Props>) {
  const newData = f.pipe(
    data,
    RA.map((obj) => ({
      name: '',
      ...obj,
    })),
  )

  const newLayout = useMemo(
    () => ({
      showlegend: false,
      title: variable,
      ...layout,
    }),
    [layout, variable],
  )

  return (
    <Plot
      data={newData as Partial<Data>[]}
      layout={newLayout}
      useResizeHandler
    />
  )
}
