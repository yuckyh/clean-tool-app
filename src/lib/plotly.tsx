import Plotly from 'plotly.js-cartesian-dist'
import createPlotlyComponent from 'react-plotly.js/factory'
import { tokens, type ColorTokens } from '@fluentui/react-components'
import type { PlotParams } from 'react-plotly.js'

type ColorToken = ColorTokens[keyof ColorTokens]

const tokenToColor = (token: ColorToken) =>
  getComputedStyle(document.body).getPropertyValue(
    token.substring(4, token.length - 1),
  )

export const fluentColorScale = (
  color1Token: ColorToken,
  color2Token: ColorToken,
  n: number,
): Plotly.ColorScale => {
  const hexToRgb = (hexColor: string): number[] => {
    return [
      parseInt(hexColor.slice(1, 3), 16),
      parseInt(hexColor.slice(3, 5), 16),
      parseInt(hexColor.slice(5, 7), 16),
    ]
  }
  const rgbToHex = (rgbColor: number[]): string => {
    return '#' + rgbColor.map((c) => c.toString(16).padStart(2, '0')).join('')
  }
  const rgb1 = hexToRgb(tokenToColor(color1Token))
  const rgb2 = hexToRgb(tokenToColor(color2Token))

  return Array.from({ length: n }, (_, i): [number, string] => {
    const t = i / (n - 1)
    const interpolatedRgb = rgb1.map((c1, j) =>
      Math.round(c1 + t * ((rgb2[j] ?? 0) - c1)),
    )
    return [t, rgbToHex(interpolatedRgb)]
  })
}

const Plot = ({ config, layout, ...props }: PlotParams) => {
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
