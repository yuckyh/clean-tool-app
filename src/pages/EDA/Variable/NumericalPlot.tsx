import type { Layout, Data } from 'plotly.js-cartesian-dist-min'

import { tokens } from '@fluentui/react-components'
import { useCallback, useMemo, useRef } from 'react'

import { console } from 'fp-ts'
import { multiply, divideBy, add } from '@/lib/number'
import { useTokenToHex } from '@/lib/hooks'
import * as RA from 'fp-ts/ReadonlyArray'
import { flow, pipe } from 'fp-ts/function'
import { getIndexedIndex, getIndexedValue, numberLookup } from '@/lib/array'
import * as N from 'fp-ts/number'
import * as P from 'fp-ts/Predicate'
import VariablePlot from './VariablePlot'

type IndexedSeries = readonly (readonly [string, number])[]

interface NumericalPlotProps {
  series: IndexedSeries
  variable: string
  unit: string
}

const jitterPower = 0.3

const jitterY = (jitter: number) => Math.random() * jitter * 2 - jitter

export default function NumericalPlot({
  variable,
  series,
  unit,
}: NumericalPlotProps) {
  const sorted = pipe(
    series,
    RA.map(flow(getIndexedValue, Number)),
    RA.sort(N.Ord),
  )

  const [q1, , q3] = useMemo(
    () =>
      RA.makeBy(
        3,
        flow(
          add(1),
          multiply(series.length),
          divideBy(4),
          Math.floor,
          numberLookup(sorted),
        ),
      ) as readonly [number, number, number],
    [series.length, sorted],
  )

  const [lower, upper] = useMemo(
    () => [2.5 * q1 - 1.5 * q3, 2.5 * q3 - 1.5 * q1] as const,
    [q1, q3],
  )

  const isOutlier = useCallback(
    ([, value]: ArrayElement<IndexedSeries>) => value < lower || value > upper,
    [lower, upper],
  )

  const isNotOutlier = useMemo(() => P.not(isOutlier), [isOutlier])

  const values = useMemo(
    () => RA.map(getIndexedValue)(series) as number[],
    [series],
  )

  const outliers = useMemo(
    () => RA.filter(isOutlier)(series),
    [isOutlier, series],
  )

  const outlierValues = useMemo(
    () => RA.map(getIndexedValue)(outliers) as number[],
    [outliers],
  )

  const outlierIndices = useMemo(
    () => RA.map(getIndexedIndex)(outliers) as string[],
    [outliers],
  )

  const outlierJitters = useMemo(
    () => RA.map(() => jitterY(jitterPower))(outliers) as number[],
    [outliers],
  )

  const outlierColor = useTokenToHex(tokens.colorBrandBackground)

  const notOutliers = useMemo(
    () => RA.filter(isNotOutlier)(series),
    [isNotOutlier, series],
  )

  const notOutlierValues = useMemo(
    () => RA.map(getIndexedValue)(notOutliers) as number[],
    [notOutliers],
  )

  const notOutlierIndices = useMemo(
    () => RA.map(getIndexedIndex)(notOutliers) as string[],
    [notOutliers],
  )

  const notOutlierJitters = useMemo(
    () => RA.map(() => jitterY(jitterPower))(notOutliers) as number[],
    [notOutliers],
  )

  const notOutlierColor = useTokenToHex(tokens.colorStatusDangerForeground3)

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
      // customdata: RA.map(getIndexedIndex)(series) as string[],
      // hovertemplate: `%{customdata}: %{x} ${unit}`,
      marker: {
        opacity: 0,
      },
      boxpoints: 'outliers',
      boxmean: true,
      type: 'box',
      jitter: 0.3,
      x: values,
      width: 1,
    },
    {
      marker: {
        color: notOutlierColor,
        symbol: 'x',
        size: 8,
      },
      hovertemplate: `%{customdata}: %{x} ${unit}`,
      customdata: notOutlierIndices,
      y: notOutlierJitters,
      x: notOutlierValues,
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
      customdata: outlierIndices,
      y: outlierJitters,
      x: outlierValues,
      type: 'scatter',
      mode: 'markers',
      yaxis: 'y2',
    },
  ]

  const ref = useRef()

  console.log(ref.current)

  return <VariablePlot variable={variable} layout={layout} data={data} />
}
