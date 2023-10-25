import type { Data, Layout } from 'plotly.js-cartesian-dist-min'

import { getCleanNumericalRow } from '@/features/sheet/selectors'
import { getIndexedIndex, getIndexedValue, numberLookup } from '@/lib/array'
import { useAppSelector, useTokenToHex } from '@/lib/hooks'
import { add, divideBy, multiply } from '@/lib/number'
import { tokens } from '@fluentui/react-components'
import { console } from 'fp-ts'
import * as E from 'fp-ts/Either'
import * as P from 'fp-ts/Predicate'
import * as RA from 'fp-ts/ReadonlyArray'
import { flip, flow, identity, pipe } from 'fp-ts/function'
import * as N from 'fp-ts/number'
import { useCallback, useMemo, useRef } from 'react'

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
          flip(divideBy)(4),
          E.fromPredicate((x) => x % 1 === 0, identity),
          E.getOrElse(Math.ceil),
          (x) => [x - 1, x] as const,
          pipe(sorted, numberLookup, RA.map),
          RA.reduce(0, N.MonoidSum.concat),
          flip(divideBy)(2),
        ),
      ) as readonly [number, number, number],
    [series.length, sorted],
  )

  const [lower, upper] = useMemo(
    () => [2.5 * q1 - 1.5 * q3, 2.5 * q3 - 1.5 * q1] as const,
    [q1, q3],
  )

  const isOutlier = useCallback(
    ([, value]: ArrayElement<typeof series>) => value < lower || value > upper,
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

  const outlierColor = useTokenToHex(tokens.colorStatusDangerForeground3)

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

  const ref = useRef()

  console.log(ref.current)

  return <VariablePlot data={data} layout={layout} variable={variable} />
}
