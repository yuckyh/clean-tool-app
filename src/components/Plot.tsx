import type { PlotParams } from 'react-plotly.js'

import { tokenToColor } from '@/lib/plotly'
import { tokens } from '@fluentui/react-components'
import Plotly from 'plotly.js-cartesian-dist'
import createPlotlyComponent from 'react-plotly.js/factory'

interface Props extends Partial<PlotParams> {
  data: Plotly.Data[]
}

const Plot = ({ config, layout, ...props }: Props) => {
  const Plot = createPlotlyComponent(Plotly)
  const plotFgColor = tokenToColor(tokens.colorNeutralStroke1)

  const defaultConfig: Partial<Plotly.Config> = {
    displayModeBar: false,
    responsive: true,
  }

  const defaultLayout: Partial<Plotly.Layout> = {
    font: {
      color: plotFgColor,
      family: 'Droid Sans',
    },
    paper_bgcolor: 'rgba(0, 0, 0, 0)',
    plot_bgcolor: 'rgba(0, 0, 0, 0)',
  }
  return (
    <Plot
      config={{ ...defaultConfig, ...config }}
      layout={{ ...defaultLayout, ...layout }}
      {...props}
    />
  )
}

export default Plot
