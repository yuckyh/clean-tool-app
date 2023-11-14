import type { Config, Data, Layout } from 'plotly.js-cartesian-dist'
import type { PlotParams } from 'react-plotly.js'

import { useTokenToHex } from '@/lib/hooks'
import { tokens } from '@fluentui/react-components'
import * as RA from 'fp-ts/ReadonlyArray'
import Plotly from 'plotly.js-cartesian-dist'
import createPlotlyComponent from 'react-plotly.js/factory'

interface Props extends Partial<PlotParams> {
  data: Data[]
}

const PlotlyPlot = createPlotlyComponent(Plotly)

// Plotly.register([Bar, Box])

const defaultConfig: Readonly<Partial<Config>> = {
  responsive: true,
}

/**
 *
 * @param props
 * @param props.config
 * @param props.layout
 * @example
 */
export default function Plot({ config, layout, ...props }: Readonly<Props>) {
  const color = useTokenToHex(tokens.colorNeutralStrokeAccessible)
  const colorway = RA.map(useTokenToHex)([
    tokens.colorBrandBackground,
    tokens.colorPaletteGreenBackground3,
    tokens.colorPaletteBerryBackground3,
    tokens.colorPaletteBerryBackground3,
    tokens.colorPaletteRedBackground3,
    tokens.colorPaletteYellowBackground3,
  ] as const) as string[]

  const defaultLayout: Readonly<Partial<Layout>> = {
    colorway,
    font: {
      color,
    },
    paper_bgcolor: 'rgba(0, 0, 0, 0)',
    plot_bgcolor: 'rgba(0, 0, 0, 0)',
  }

  return (
    <PlotlyPlot
      config={{ ...defaultConfig, ...config }}
      layout={{ ...defaultLayout, ...layout }}
      useResizeHandler
      {...props}
    />
  )
}
