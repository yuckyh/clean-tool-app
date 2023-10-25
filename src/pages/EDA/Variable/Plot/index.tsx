import type { Data, Layout } from 'plotly.js-cartesian-dist-min'

import Plot from '@/components/Plot'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import { useMemo } from 'react'

interface Props {
  data: readonly Partial<Data>[]
  layout: Partial<Layout>
  variable: string
}

export default function VariablePlot({
  data,
  layout,
  variable,
}: Readonly<Props>) {
  const newData = pipe(
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
