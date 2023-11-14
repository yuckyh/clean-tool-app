import type { AppState } from '@/app/store'
import type { Data, Layout } from 'plotly.js-cartesian-dist'

import {
  getIndexedNumericalRow,
  getNotOutliers,
  getOutliers,
} from '@/features/sheet/selectors'
import { getIndexedIndex, getIndexedValue } from '@/lib/array'
import { useAppSelector, useTokenToHex } from '@/lib/hooks'
import { tokens } from '@fluentui/react-components'
import * as RA from 'fp-ts/ReadonlyArray'
import { useMemo } from 'react'

import VariablePlot from '.'

const jitterPower = 0.3

/**
 *
 * @param jitter
 * @returns
 * @example
 */
const jitterY = (jitter: number) => Math.random() * jitter * 2 - jitter

/**
 * Props for the numerical plot component {@link NumericalPlot}.
 * @example
 * ```tsx
 * <NumericalPlot
 *   column="al_r"
 *   unit="mm"
 *   variable="al_r_1"
 *   visit="1" />
 * ```
 */
interface Props {
  /**
   * The column used to get the row for plotting.
   */
  column: string
  /**
   * The measurement unit.
   */
  unit: string
  /**
   * The variable name of the formatted column and visit for the plot.
   */
  variable: string
  /**
   * The visit for the plot.
   */
  visit: string
}

/**
 *
 * @param props
 * @param props.column
 * @param props.visit
 * @returns
 * @example
 */
const selectSeries =
  ({ column, visit }: Readonly<Props>) =>
  (state: AppState) =>
    getIndexedNumericalRow(state, column, visit)

/**
 *
 * @param props
 * @param props.column
 * @param props.visit
 * @returns
 * @example
 */
const selectOutliers =
  ({ column, visit }: Readonly<Props>) =>
  (state: AppState) =>
    getOutliers(state, column, visit)

/**
 *
 * @param props
 * @param props.column
 * @param props.visit
 * @returns
 * @example
 */
const selectNonOutliers =
  ({ column, visit }: Readonly<Props>) =>
  (state: AppState) =>
    getNotOutliers(state, column, visit)

/**
 * The function to generate render the numerical plot. The plot is currently configured to render only a box plot.
 *
 * The box plot is rendered with the outliers as red x's and the non-outliers as blue x's.
 *
 * The y-axis is jittered to prevent the x's from overlapping.
 * @category Component
 * @group Plot
 * @param props - The component's props
 * @param props.column - The column used to get the row for plotting
 * @param props.unit - The unit of measurement for the variable
 * @param props.variable - The variable name of the formatted column and visit for the plot
 * @param props.visit - The visit for the plot
 * @returns The numerical plot component
 * @example A variable with column name `al_r` and visit `1` with unit `mm` will have variable `al_r_1` resulting to the following usage:
 * ```tsx
 * <NumericalPlot
 *   column="al_r"
 *   unit="mm"
 *   variable="al_r_1"
 *   visit="1" />
 * ```
 */
export default function NumericalPlot(
  props: Readonly<Props>,
): Readonly<JSX.Element> {
  const { unit, variable } = props

  const series = useAppSelector(selectSeries(props))

  const outliers = useAppSelector(selectOutliers(props))

  const notOutliers = useAppSelector(selectNonOutliers(props))

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

  const layout: Readonly<Partial<Layout>> = {
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

  const data: readonly Readonly<Partial<Data>>[] = [
    {
      boxmean: true,
      boxpoints: 'outliers',
      hovertemplate: `%{customdata}: %{x} ${unit}`,
      jitter: 0.3,
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
