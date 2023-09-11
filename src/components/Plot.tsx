import { tokenToColor } from '@/lib/plotly'
import { tokens } from '@fluentui/react-components'
import Plotly from 'plotly.js-cartesian-dist'
import type { PlotParams } from 'react-plotly.js'
import createPlotlyComponent from 'react-plotly.js/factory'

interface PlotProps extends Partial<PlotParams> {
  data: Plotly.Data[]
}

const Plot = ({ config, layout, ...props }: PlotProps) => {
  const Plot = createPlotlyComponent(Plotly)
  const plotFgColor = tokenToColor(tokens.colorNeutralForeground1)

  const defaultConfig: Partial<Plotly.Config> = {
    displayModeBar: false,
    responsive: true,
  }

  const defaultLayout: Partial<Plotly.Layout> = {
    paper_bgcolor: 'rgba(0, 0, 0, 0)',
    plot_bgcolor: 'rgba(0, 0, 0, 0)',
    font: {
      family: 'Droid Sans',
      color: plotFgColor,
    },
  }
  return (
    <Plot
      layout={{ ...defaultLayout, ...layout }}
      config={{ ...defaultConfig, ...config }}
      {...props}
    />
  )
}

export default Plot
