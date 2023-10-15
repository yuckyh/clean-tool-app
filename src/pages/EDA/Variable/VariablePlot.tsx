import type { Layout, Data } from 'plotly.js-cartesian-dist-min'

import { map } from 'lodash/fp'
import Plot from '@/components/Plot'

interface Props {
  layout: Partial<Layout>
  data: Partial<Data>[]
  variable: string
}

export default function VariablePlot({ variable, layout, data }: Props) {
  return (
    <Plot
      layout={{
        showlegend: false,
        title: variable,
        ...layout,
      }}
      data={map<Data, Data>((obj) => ({
        name: '',
        ...obj,
      }))(data)}
      useResizeHandler
    />
  )
}
