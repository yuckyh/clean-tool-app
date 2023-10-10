import type { Layout, Data } from 'plotly.js-cartesian-dist-min'

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
  createTableColumn,
  DataGridProps,
  TableRowId,
  Spinner,
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
import SimpleDataGrid from '@/components/SimpleDataGrid'

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
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalXL,
    width: '100%',
  },
  columns: {
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
  columnHeader: {
    fontWeight: 'bold',
  },
})

export const Component = () => {
  const classes = useClasses()

  const dispatch = useAppDispatch()

  const params = useParams()

  const formattedFileName = useAppSelector(getFormattedFileName)
  const dataset = useAppSelector((state) => getData(state, false))

  const [isLoading, setIsLoading] = useLoadingTransition()

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

  useEffect(() => {
    void dispatch(fetchWorkbook(formattedFileName)).then(() => {
      setIsLoading(false)
    })
  }, [dispatch, formattedFileName, setIsLoading])

  const columnsDefinition = useMemo(
    () => [
      createTableColumn<number>({
        renderHeaderCell: () => <div className={classes.columnHeader}>sno</div>,
        renderCell: (row) => index[row] ?? '',
        columnId: 'index',
      }),
      createTableColumn<number>({
        renderHeaderCell: () => <div>{variable}</div>,
        renderCell: (row) => series[row] ?? '',
        columnId: variable,
      }),
    ],
    [classes.columnHeader, dataset.length],
  )

  const [flaggedRows, setFlaggedRows] = useState(new Set<TableRowId>([]))

  const handleSelectionChange: DataGridProps['onSelectionChange'] = (
    _,
    { selectedItems },
  ) => {
    setFlaggedRows(selectedItems)
  }

  const isParsedCategorical =
    series.some((value) => !value.replace(/[^.!?]*[.!?]$/, '')) ||
    series.some((value) => isNaN(Number(value)))

  return !isLoading ? (
    <section className={classes.root}>
      <div className={classes.columns}>
        <div className={classes.plot}>
          <Card>
            {isParsedCategorical || isCategorical ? (
              <CategoricalPlot series={series} variable={variable} />
            ) : (
              <NumericalPlot
                series={series}
                variable={variable}
                unit={unit}
                index={index}
              />
            )}
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
      </div>
      <div className={classes.columns}>
        <SimpleDataGrid
          selectionMode="multiselect"
          selectedItems={flaggedRows}
          onSelectionChange={handleSelectionChange}
          items={range(dataset.length)}
          columns={columnsDefinition}
          cellFocusMode={() => 'none'}
        />
      </div>
    </section>
  ) : (
    <Spinner
      label={<Title1>Plotting Data...</Title1>}
      labelPosition="below"
      size="huge"
    />
  )
}

interface VariablePlotProps {
  variable: string
  layout: Partial<Layout>
  data: Partial<Data>[]
}

const VariablePlot = ({ variable, layout, data }: VariablePlotProps) => (
  <Plot
    layout={{
      showlegend: false,
      title: variable,
      ...layout,
    }}
    data={data.map((obj) => ({
      name: '',
      ...obj,
    }))}
    useResizeHandler
  />
)

interface CategoricalPlotProps {
  series: string[]
  variable: string
}

const CategoricalPlot = ({ series, variable }: CategoricalPlotProps) => {
  const count = useMemo(
    () =>
      series.reduce<Record<string, number>>((acc, curr) => {
        acc[curr] = (acc[curr] ?? 0) + 1
        return acc
      }, {}),
    [series],
  )

  const maxCount = useMemo(() => Math.max(...Object.values(count)), [count])

  const data: Partial<Data>[] = [
    {
      type: 'bar',
      y: Object.values(count),
      x: Object.keys(count),
    },
  ]

  const layout: Partial<Layout> = {
    yaxis: {
      tickvals: range(maxCount + 1, 0),
      range: [0, maxCount],
      tickformat: 'd',
    },
    xaxis: {
      type: 'category',
    },
  }

  return <VariablePlot data={data} layout={layout} variable={variable} />
}

interface NumericalPlotProps {
  series: string[]
  variable: string
  unit: string
  index: string[]
}

const NumericalPlot = ({
  series,
  variable,
  unit,
  index,
}: NumericalPlotProps) => {
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
      marker: {
        opacity: 0,
      },
      hovertemplate: `%{customdata}: %{x} ${unit}`,
      type: 'box',
      boxpoints: 'outliers',
      customdata: index,
      boxmean: 'sd',
      pointpos: -2,
      jitter: 0.3,
      x: series,
      width: 1,
    },
    {
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

  return <VariablePlot layout={layout} variable={variable} data={data} />
}
