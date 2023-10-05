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
  useAsyncEffect,
  useEffectLog,
} from '@/lib/hooks'
import { getFormattedFileName, getData } from '@/features/sheet/selectors'
import { fetchWorkbook } from '@/features/sheet/actions'
import { useParams } from 'react-router-dom'
import { slugToSnake } from '@/lib/string'
import Plot from '@/components/Plot'
import { range } from '@/lib/array'
import { codebook } from '@/data'
import { useMemo } from 'react'

type VariableType = Extract<Property<typeof variableType>, string>

const variableType = ['numerical', 'categorical'] as const

// TODO: Hover show index

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

  const variable = slugToSnake(params.variable ?? '')

  const dataType = codebook.find(({ name }) => name === variable)?.type ?? ''

  useEffectLog(dataType)

  const type: VariableType = ['whole_number', 'interval'].includes(dataType)
    ? 'numerical'
    : 'categorical'

  const isCategorical = type === 'categorical'

  const series = useMemo(
    () => dataset.map((row) => `${row[variable]}`),
    [dataset, variable],
  )

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

  useAsyncEffect(async () => {
    await dispatch(fetchWorkbook(formattedFileName))
    setIsLoading(false)
  }, [dispatch, formattedFileName])

  const commonData = { type: plotTypes[type] }

  const commonLayout = {
    datarevision: series,
  }

  const numericalData = [
    {
      ...commonData,
      x: series,
    },
  ]

  const categoricalData = [
    {
      ...commonData,
      y: Object.values(count),
      x: Object.keys(count),
    },
  ]

  const categoricalLayout = {
    ...commonLayout,
    yaxis: {
      tickvals: range(maxCount + 1, 0),
      range: [0, maxCount],
      tickformat: 'd',
    },
  }

  const data = isCategorical ? categoricalData : numericalData

  const layout = isCategorical ? categoricalLayout : commonLayout

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
            {type !== 'categorical' && (
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

Component.displayName = 'Variable'
