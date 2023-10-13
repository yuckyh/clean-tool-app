import type { Layout, Data } from 'plotly.js-cartesian-dist-min'

import { tokens } from '@fluentui/react-components'
import { useRef } from 'react'
import { accessArray, range } from '@/lib/array'

import VariablePlot from './VariablePlot'
import { list } from '@/lib/monads'
import { multiply, divideBy } from '@/lib/number'
import { useTokenToHex } from '@/lib/hooks'

type IndexedSeries = (readonly [number, string])[]

interface NumericalPlotProps {
  series: IndexedSeries
  variable: string
  unit: string
}

const jitter = 0.3

const jitterY = () => Math.random() * jitter * 2 - jitter
const getValue = ([value = Infinity]: ArrayElement<IndexedSeries>) => value
const getIndex = ([, index = '']: ArrayElement<IndexedSeries>) => index

export default function NumericalPlot({
  variable,
  series,
  unit,
}: NumericalPlotProps) {
  const sorted = (list(series)(getValue)(Number)() as number[]).sort(
    (a, b) => a - b,
  )

  const [q1, , q3] = list(range(4, 1))(multiply)
    .pass(series.length)(divideBy)
    .pass(4)(Math.floor)(accessArray)
    .pass(sorted)() as [number, number, number]

  const [lower, upper] = [2.5 * q1 - 1.5 * q3, 2.5 * q3 - 1.5 * q1] as const

  const isOutlier = ([value]: ArrayElement<IndexedSeries>) =>
    value < lower || value > upper
  const isNotOutlier = ([value]: ArrayElement<IndexedSeries>) =>
    value > lower && value < upper

  const outliers = series.filter(isOutlier)

  const notOutliers = series.filter(isNotOutlier)

  const notOutlierColor = useTokenToHex(tokens.colorBrandBackground)
  const outlierColor = useTokenToHex(tokens.colorStatusDangerForeground3)

  const layout: Partial<Layout> = {
    yaxis2: {
      zeroline: false,
      range: [-1, 5],
      tickvals: [],
    },
    yaxis: {
      range: [-1, 1],
      tickvals: [],
    },
    xaxis: {
      title: unit,
    },
  }

  const data: Partial<Data>[] = [
    {
      hovertemplate: `%{customdata}: %{x} ${unit}`,
      marker: {
        opacity: 0,
      },
      customdata: series.map(getIndex),
      x: series.map(getValue),
      boxpoints: 'outliers',
      boxmean: true,
      // pointpos: -2,
      type: 'box',
      jitter: 0.3,
      width: 1,
    },
    {
      marker: {
        color: notOutlierColor,
        symbol: 'x',
        size: 8,
      },
      hovertemplate: `%{customdata}: %{x} ${unit}`,
      customdata: notOutliers.map(getIndex),
      x: notOutliers.map(getValue),
      y: notOutliers.map(jitterY),
      type: 'scatter',
      mode: 'markers',
      yaxis: 'y2',
    },
    {
      marker: {
        color: outlierColor,
        symbol: 'x',
        size: 8,
      },
      hovertemplate: `%{customdata}: %{x} ${unit}`,
      customdata: outliers.map(getIndex),
      x: outliers.map(getValue),
      y: outliers.map(jitterY),
      type: 'scatter',
      mode: 'markers',
      yaxis: 'y2',
    },
  ]

  const ref = useRef()

  console.log(ref.current)

  return <VariablePlot variable={variable} layout={layout} data={data} />
}
