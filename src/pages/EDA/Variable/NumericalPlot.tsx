import type { Layout, Data } from 'plotly.js-cartesian-dist-min'

import { tokens } from '@fluentui/react-components'
import { useRef } from 'react'

import { console } from 'fp-ts'
import { multiply, divideBy, add } from '@/lib/number'
import { useTokenToHex } from '@/lib/hooks'
import { filter, makeBy, sort, map } from 'fp-ts/ReadonlyArray'
import { constant, flow, pipe } from 'fp-ts/function'
import { numberLookup } from '@/lib/array'
import N from 'fp-ts/number'
import VariablePlot from './VariablePlot'

type IndexedSeries = readonly (readonly [string, number])[]

interface NumericalPlotProps {
  series: IndexedSeries
  variable: string
  unit: string
}

const jitter = 0.3

const jitterY = constant(Math.random() * jitter * 2 - jitter)
const getValue = ([, value]: ArrayElement<IndexedSeries>) => value
const getIndex = ([index = '']: ArrayElement<IndexedSeries>) => index

export default function NumericalPlot({
  variable,
  series,
  unit,
}: NumericalPlotProps) {
  const sorted = pipe(series, map(flow(getValue, Number)), sort(N.Ord))

  const [q1, , q3] = makeBy(
    3,
    flow(
      add(1),
      multiply(series.length),
      divideBy(4),
      Math.floor,
      numberLookup(sorted),
    ),
  ) as readonly [number, number, number]

  const [lower, upper] = [2.5 * q1 - 1.5 * q3, 2.5 * q3 - 1.5 * q1] as const

  const isOutlier = ([, value]: ArrayElement<IndexedSeries>) =>
    value < lower || value > upper

  const isNotOutlier = (element: ArrayElement<IndexedSeries>) =>
    !isOutlier(element)

  const outliers = filter(isOutlier)(series)

  const notOutliers = filter(isNotOutlier)(series)

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
      customdata: map(getIndex)(series) as string[],
      hovertemplate: `%{customdata}: %{x} ${unit}`,
      marker: {
        opacity: 0,
      },
      x: map(getValue)(series) as number[],
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
      customdata: map(getIndex)(notOutliers) as string[],
      hovertemplate: `%{customdata}: %{x} ${unit}`,
      x: map(getValue)(notOutliers) as number[],
      y: map(jitterY)(notOutliers) as number[],
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
      customdata: map(getIndex)(outliers) as string[],
      hovertemplate: `%{customdata}: %{x} ${unit}`,
      x: map(getValue)(outliers) as number[],
      y: map(jitterY)(outliers) as number[],
      type: 'scatter',
      mode: 'markers',
      yaxis: 'y2',
    },
  ]

  const ref = useRef()

  console.log(ref.current)

  return <VariablePlot variable={variable} layout={layout} data={data} />
}
