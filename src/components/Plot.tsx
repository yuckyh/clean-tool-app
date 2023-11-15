/**
 * @file This file contains the base Plot component.
 * @module components/Plot
 */

import type { Config, Data, Layout } from 'plotly.js-cartesian-dist'
import type { PlotParams } from 'react-plotly.js'

import { useTokenToHex } from '@/lib/hooks'
import { tokens } from '@fluentui/react-components'
import * as RA from 'fp-ts/ReadonlyArray'
import Plotly from 'plotly.js-cartesian-dist'
import createPlotlyComponent from 'react-plotly.js/factory'

/**
 * The props for plotly.js's {@link Plot} component.
 */
interface Props extends Partial<PlotParams> {
  /**
   * A list of plotly.js data objects.
   */
  data: Data[]
}

const PlotlyPlot = createPlotlyComponent(Plotly)

const defaultConfig: Readonly<Partial<Config>> = {
  responsive: true,
}

/**
 * This component is a wrapper around {@link Plotly} from react-plotly.js.
 *
 * The purpose of this component is to have a base Plot component that can be
 * used throughout the application. It also helps to minimize the bundle size.
 *
 * It provides a default config and layout, and uses Fluent UI tokens for
 * colors. This components also defaults the component to be responsive.
 * @param props - The {@link Props props} passed to the component.
 * @param props.config - The plotly {@link Config config} config objects to
 * @param props.layout - The plotly {@link Layout layout} config objects to override the defaults.
 * @returns - The {@link Plotly} component.
 * @example
 * ```tsx
 * <Plot
 *   data={[
 *    {
 *      x: [1, 2, 3],
 *      y: [2, 6, 3],
 *      type: 'scatter',
 *      mode: 'lines+points',
 *      marker: {color: 'red'},
 *    },
 *    {
 *      type: 'bar',
 *      x: [1, 2, 3],
 *      y: [2, 5, 3]},
 *  ]}
 * />
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
