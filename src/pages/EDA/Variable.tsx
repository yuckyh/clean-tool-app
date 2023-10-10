import type { PlotType, Layout, Data } from 'plotly.js-cartesian-dist-min'

import {
  CardFooter,
  CardHeader,
  makeStyles,
  shorthands,
  Button,
  Title1,
  tokens,
  Field,
  Input,
  Card,
} from '@fluentui/react-components'
import {
  useLoadingTransition,
  useAppDispatch,
  useAppSelector,
} from '@/lib/hooks'
import { getFormattedFileName, getData } from '@/features/sheet/selectors'
import { useCallback, useEffect, useState, useMemo } from 'react'
import { fetchWorkbook } from '@/features/sheet/actions'
import { useParams } from 'react-router-dom'
import { tokenToHex } from '@/lib/plotly'
import Plot from '@/components/Plot'
import { range } from '@/lib/array'
import { codebook } from '@/data'
import _ from 'lodash'

type VariableType = Extract<Property<typeof variableType>, string>

const variableType = ['numerical', 'categorical'] as const

const useClasses = makeStyles({
  card: {
    width: '100%',
    ...shorthands.margin(0, 'auto'),
    ...shorthands.padding(tokens.spacingHorizontalXXXL, '5%'),
  },
  actions: {
    columnGap: tokens.spacingVerticalS,
    flexDirection: 'row',
    display: 'flex',
    width: '100%',
  },
  root: {
    columnGap: tokens.spacingVerticalXL,
    display: 'flex',
    width: '100%',
  },
  options: {
    flexBasis: '0',
    flexShrink: 1,
    flexGrow: 1,
  },
  plot: {
    flexBasis: '0',
    flexShrink: 2,
    flexGrow: 2,
  },
})

const plotTypes: Record<VariableType, PlotType> = {
  categorical: 'bar',
  numerical: 'box',
}

export const Component = () => {
  const classes = useClasses()

  const dispatch = useAppDispatch()

  const params = useParams()

  const formattedFileName = useAppSelector(getFormattedFileName)
  const dataset = useAppSelector((state) => getData(state, false))

  const column = params.column?.replace(/-/g, '_') ?? ''
  const visit = params.visit ?? ''

  const variable = `${column}${visit ? `_${visit}` : ''}`

  const codebookVariable = codebook.find(({ name }) => name === column) ?? {
    description: '',
    category: '',
    name: '',
    type: '',
    unit: '',
  }

  const isCustom = !codebookVariable.name

  console.log(isCustom)

  const { type, unit } = codebookVariable

  const measurementType: VariableType = ['whole_number', 'interval'].includes(
    type,
  )
    ? 'numerical'
    : 'categorical'

  const isCategorical = measurementType === 'categorical'

  const series = useMemo(
    () => dataset.map((row) => `${row[variable]}`),
    [dataset, variable],
  )

  const index = useMemo(() => dataset.map((row) => `${row.sno}`), [dataset])

  const count = useMemo(
    () =>
      series.reduce<Record<string, number>>((acc, curr) => {
        acc[curr] = (acc[curr] ?? 0) + 1
        return acc
      }, {}),
    [series],
  )

  const maxCount = useMemo(() => Math.max(...Object.values(count)), [count])

  const [isLoading, setIsLoading] = useLoadingTransition()

  const [dataRevision, setDataRevision] = useState(0)

  useEffect(() => {
    void dispatch(fetchWorkbook(formattedFileName)).then(() => {
      setIsLoading(false)
    })
  }, [dispatch, formattedFileName, setIsLoading])

  useEffect(() => {
    setDataRevision((prev) => prev + 1)
  }, [series])

  const quartiles = useMemo(() => {
    const sorted = series.map(Number).sort((a, b) => a - b)
    return range(4, 1).map(
      (q) => sorted[Math.floor((series.length * q) / 4)] ?? 0,
    ) as [number, number, number]
  }, [series])

  const fences = useMemo(() => {
    const [q1, , q3] = quartiles
    return [2.5 * q1 - 1.5 * q3, 2.5 * q3 - 1.5 * q1] as const
  }, [quartiles])

  const isOutlier = useCallback(
    (value: string) =>
      parseInt(value) < fences[0] || parseInt(value) > fences[1],
    [fences],
  )

  const outliers = useMemo(
    () =>
      series.length && index.length
        ? _.zip(series, index).filter(([value = '0']) => isOutlier(value))
        : [],
    [series, index, isOutlier],
  )

  const notOutliers = useMemo(
    () =>
      series.length && index.length
        ? _.zip(series, index).filter(([value = '0']) => !isOutlier(value))
        : [],
    [series, index, isOutlier],
  )
  const commonData = {
    name: '',
  }

  const commonLayout: Partial<Layout> = {
    datarevision: dataRevision,
    showlegend: false,
    title: variable,
  }

  const data: Partial<Data>[] = isCategorical
    ? [
        {
          ...commonData,
          type: plotTypes[measurementType],
          y: Object.values(count),
          x: Object.keys(count),
        },
      ]
    : [
        {
          ...commonData,
          marker: {
            opacity: 0,
          },
          hovertemplate: `%{customdata}: %{x} ${unit}`,
          type: plotTypes[measurementType],
          boxpoints: 'outliers',
          customdata: index,
          boxmean: 'sd',
          pointpos: -2,
          jitter: 0.3,
          x: series,
          width: 1,
        },
        {
          ...commonData,
          marker: {
            color: tokenToHex(tokens.colorBrandBackground),
            symbol: 'x',
            size: 8,
          },
          customdata: notOutliers.map(([, index = '']) => index),
          y: series.map(() => Math.random() * 0.2 - 0.1),
          hovertemplate: `%{customdata}: %{x} ${unit}`,
          x: notOutliers.map(([value = '0']) => value),
          type: 'scatter',
          mode: 'markers',
          yaxis: 'y2',
        },
        {
          ...commonData,
          marker: {
            color: tokenToHex(tokens.colorStatusDangerForeground3),
            symbol: 'x',
            size: 8,
          },
          customdata: outliers.map(([, index = '']) => index),
          y: series.map(() => Math.random() * 0.2 - 0.1),
          hovertemplate: `%{customdata}: %{x} ${unit}`,
          x: outliers.map(([value = '0']) => value),
          type: 'scatter',
          mode: 'markers',
          yaxis: 'y2',
        },
      ]

  const layout: Partial<Layout> = isCategorical
    ? {
        ...commonLayout,
        yaxis: {
          tickvals: range(maxCount + 1, 0),
          range: [0, maxCount],
          tickformat: 'd',
        },
      }
    : {
        ...commonLayout,
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

  return (
    !isLoading && (
      <section className={classes.root}>
        <div className={classes.plot}>
          <Card>
            <Plot layout={layout} data={data} />
          </Card>
        </div>
        <div className={classes.options}>
          <Card className={classes.card} size="large">
            <CardHeader header={<Title1>Plot Options</Title1>} />
            {measurementType !== 'categorical' && (
              <div>
                <Field label="Minimum value">
                  <Input appearance="filled-darker" type="number" />
                </Field>
                <Field label="Maximum value">
                  <Input appearance="filled-darker" type="number" />
                </Field>
              </div>
            )}
            <CardFooter
              action={
                <div className={classes.actions}>
                  <Button appearance="primary">Plot</Button>
                </div>
              }
            />
          </Card>
        </div>
      </section>
    )
  )
}
