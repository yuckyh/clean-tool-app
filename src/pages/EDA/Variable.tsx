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
import { fetchWorkbook } from '@/features/sheet/actions'
import { useEffect, useState, useMemo } from 'react'
import { transpose, range } from '@/lib/array'
import { useParams } from 'react-router-dom'
import { tokenToHex } from '@/lib/plotly'
import Plot from '@/components/Plot'
import { codebook } from '@/data'

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

const plotTypes: Record<VariableType, Plotly.PlotType> = {
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

  console.log(variable)

  const codebookVariable = codebook.find(({ name }) => name === column) ?? {
    description: '',
    category: '',
    name: '',
    type: '',
    unit: '',
  }

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
  }, [dispatch, formattedFileName])

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

  const outliers = useMemo(
    () =>
      series.length && index.length
        ? transpose(
            transpose([series, index] as const).filter(
              ([value]) =>
                parseInt(value) < fences[0] || parseInt(value) > fences[1],
            ),
          )
        : [],
    [series, index, fences],
  )

  const notOutliers = useMemo(
    () =>
      series.length && index.length
        ? transpose(
            transpose([series, index] as const).filter(
              ([value]) =>
                parseInt(value) >= fences[0] && parseInt(value) <= fences[1],
            ),
          )
        : [],
    [series, index, fences],
  )

  const commonData = {
    name: '',
  }

  const commonLayout: Partial<Plotly.Layout> = {
    datarevision: dataRevision,
    showlegend: false,
    title: variable,
  }

  const data: Partial<Plotly.Data>[] = isCategorical
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
          y: series.map(() => Math.random() * 0.2 - 0.1),
          hovertemplate: `%{customdata}: %{x} ${unit}`,
          customdata: notOutliers[1],
          x: notOutliers[0],
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
          y: series.map(() => Math.random() * 0.2 - 0.1),
          hovertemplate: `%{customdata}: %{x} ${unit}`,
          customdata: outliers[1],
          type: 'scatter',
          mode: 'markers',
          x: outliers[0],
          yaxis: 'y2',
        },
      ]

  const layout: Partial<Plotly.Layout> = isCategorical
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
              <>
                <Field label="Minimum value">
                  <Input appearance="filled-darker" type="number" />
                </Field>
                <Field label="Maximum value">
                  <Input appearance="filled-darker" type="number" />
                </Field>
              </>
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
