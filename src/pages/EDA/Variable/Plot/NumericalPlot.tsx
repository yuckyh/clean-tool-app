import type { Data, Layout } from 'plotly.js-cartesian-dist'

import {
  getCleanNumericalRow,
  getNotOutliers,
  getOutliers,
} from '@/features/sheet/selectors'
import { getIndexedIndex, getIndexedValue } from '@/lib/array'
import { useAppSelector, useTokenToHex } from '@/lib/hooks'
import { tokens } from '@fluentui/react-components'
import * as RA from 'fp-ts/ReadonlyArray'
import { useMemo } from 'react'

import VariablePlot from '.'

interface NumericalPlotProps {
  column: string
  unit: string
  variable: string
  visit: string
}

const jitterPower = 0.3

const jitterY = (jitter: number) => Math.random() * jitter * 2 - jitter

export default function NumericalPlot({
  column,
  unit,
  variable,
  visit,
}: NumericalPlotProps) {
  const series = useAppSelector((state) =>
    getCleanNumericalRow(state, column, visit),
  )

  const outliers = useAppSelector((state) => getOutliers(state, column, visit))

  const notOutliers = useAppSelector((state) =>
    getNotOutliers(state, column, visit),
  )

  const values = useMemo(
    () => RA.map(getIndexedValue)(series) as number[],
    [series],
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

  const outlierColor = useTokenToHex(tokens.colorStatusDangerForeground3)

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

  const notOutlierColor = useTokenToHex(tokens.colorBrandBackground)

  const layout: Partial<Layout> = {
    xaxis: {
      title: unit,
    },
    yaxis: {
      range: [-1, 1],
      tickvals: [],
    },
    yaxis2: {
      range: [-1, 5],
      tickvals: [],
      zeroline: false,
    },
  }

  const data: Partial<Data>[] = [
    {
      // customdata: RA.map(getIndexedIndex)(series) as string[],
      boxmean: true,
      boxpoints: 'outliers',
      jitter: 0.3,
      // hovertemplate: `%{customdata}: %{x} ${unit}`,
      marker: {
        opacity: 0,
      },
      type: 'box',
      width: 1,
      x: values,
    },
    {
      customdata: notOutlierIndices,
      hovertemplate: `%{customdata}: %{x} ${unit}`,
      marker: {
        color: notOutlierColor,
        size: 8,
        symbol: 'x',
      },
      mode: 'markers',
      type: 'scatter',
      x: notOutlierValues,
      y: notOutlierJitters,
      yaxis: 'y2',
    },
    {
      customdata: outlierIndices,
      hovertemplate: `%{customdata}: %{x} ${unit}`,
      marker: {
        color: outlierColor,
        size: 8,
        symbol: 'x',
      },
      mode: 'markers',
      type: 'scatter',
      x: outlierValues,
      y: outlierJitters,
      yaxis: 'y2',
    },
  ]

  return <VariablePlot data={data} layout={layout} variable={variable} />
}
