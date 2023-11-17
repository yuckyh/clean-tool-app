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
 *
 * @param props - The {@link Props props} for the component.
 * @param props.data
 * @param props.layout
 * @param props.variable
 * @returns
 * @example
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
