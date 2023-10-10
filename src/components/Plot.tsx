import type { Config, Layout, Data } from 'plotly.js-cartesian-dist-min'
import type { PlotParams } from 'react-plotly.js'

import createPlotlyComponent from 'react-plotly.js/factory'
import { tokens } from '@fluentui/react-components'
import Plotly from 'plotly.js-cartesian-dist-min'
import { tokenToHex } from '@/lib/plotly'
import { useMemo } from 'react'

interface Props extends Partial<PlotParams> {
  data: Data[]
}

const PlotlyPlot = createPlotlyComponent(Plotly)

const Plot = ({ config, layout, ...props }: Props) => {
  const defaultConfig: Partial<Config> = useMemo(
    () => ({
      responsive: true,
    }),
    [],
  )

  const defaultLayout: Partial<Layout> = useMemo(
    () => ({
      colorway: [
        tokens.colorBrandBackground,
        tokens.colorPaletteGreenBackground3,
        tokens.colorPaletteBerryBackground3,
        tokens.colorPalettePurpleBackground2,
        tokens.colorPaletteRedBackground3,
        tokens.colorPaletteYellowBackground3,
      ].map(tokenToHex),
      font: {
        color: tokenToHex(tokens.colorNeutralStrokeAccessible),
        family: 'Droid Sans',
      },
      paper_bgcolor: 'rgba(0, 0, 0, 0)',
      plot_bgcolor: 'rgba(0, 0, 0, 0)',
    }),
    [],
  )

  return (
    <PlotlyPlot
      config={{ ...defaultConfig, ...config }}
      layout={{ ...defaultLayout, ...layout }}
      useResizeHandler
      {...props}
    />
  )
}

export default Plot
