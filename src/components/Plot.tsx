import type { Config, Layout, Data } from 'plotly.js'
import type { PlotParams } from 'react-plotly.js'

import createPlotlyComponent from 'react-plotly.js/factory'
import { tokens } from '@fluentui/react-components'
import Plotly from 'plotly.js-cartesian-dist'
import { useTokenToHex } from '@/lib/hooks'
import { pipe } from 'fp-ts/function'
import * as RA from 'fp-ts/ReadonlyArray'

interface Props extends Partial<PlotParams> {
  data: Data[]
}

const PlotlyPlot = createPlotlyComponent(Plotly)

// Plotly.register([Bar, Box])

const defaultConfig: Partial<Config> = {
  responsive: true,
}

export default function Plot({ config, layout, ...props }: Props) {
  const color = useTokenToHex(tokens.colorNeutralStrokeAccessible)
  const colorway = pipe(
    [
      tokens.colorBrandBackground,
      tokens.colorPaletteGreenBackground3,
      tokens.colorPaletteBerryBackground3,
      tokens.colorPalettePurpleBackground2,
      tokens.colorPaletteRedBackground3,
      tokens.colorPaletteYellowBackground3,
    ] as const,
    RA.map(useTokenToHex),
  ) as string[]

  const defaultLayout: Partial<Layout> = {
    paper_bgcolor: 'rgba(0, 0, 0, 0)',
    plot_bgcolor: 'rgba(0, 0, 0, 0)',
    font: {
      color,
    },
    colorway,
  }

  // console.log('rendering', colorway, color, config, layout, props)

  return (
    <PlotlyPlot
      config={{ ...defaultConfig, ...config }}
      layout={{ ...defaultLayout, ...layout }}
      useResizeHandler
      {...props}
    />
  )
}
