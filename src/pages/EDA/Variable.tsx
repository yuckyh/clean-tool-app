import Plot from '@/components/Plot'
import { codebook } from '@/data'
import { fetchWorkbook, getFormattedData } from '@/features/sheetSlice'
import {
  useAppDispatch,
  useAppSelector,
  useAsyncEffect,
  useLoadingTransition,
} from '@/lib/hooks'
import { slugToSnake } from '@/lib/string'
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Field,
  Input,
  Title1,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import { useParams } from 'react-router-dom'

type VariableType = Extract<Property<typeof variableType>, string>

const variableType = ['numerical', 'categorical'] as const

// TODO: data indexing for long data
// TODO: Hover show index
// TODO: data type detection

const useClasses = makeStyles({
  actions: {
    display: 'grid',
    gridAutoFlow: 'column',
    width: '100%',
    ...shorthands.gap(tokens.spacingVerticalS, 0),
  },
  card: {
    width: '100%',
    ...shorthands.margin(0, 'auto'),
    ...shorthands.padding(tokens.spacingHorizontalXXXL, '5%'),
  },
  options: {
    flexGrow: 1,
    width: `${100 / 3}%`,
  },
  plot: {
    flexShrink: 1,
    width: `${(100 / 3) * 2}%`,
  },
  root: {
    display: 'flex',
    width: '100%',
  },
})

const plotTypes: Record<VariableType, Plotly.PlotType> = {
  categorical: 'bar',
  numerical: 'box',
}

export const Component = () => {
  const params = useParams()
  const dispatch = useAppDispatch()
  const { fileName } = useAppSelector(({ sheet }) => sheet)
  const data = useAppSelector(getFormattedData)

  const classes = useClasses()
  const variable = slugToSnake(params.variable ?? '')
  const dataType = codebook.find(({ name }) => name === variable)?.type ?? ''
  const type: VariableType = ['interval', 'whole_number'].includes(dataType)
    ? 'numerical'
    : 'categorical'
  const [isLoading, setIsLoading] = useLoadingTransition()

  console.log(Object.keys(data[0] ?? {}))
  console.log(dataType)
  console.log(variable)
  console.log(Array.from(new Set(codebook.map(({ type }) => type))))

  const series = data.map((row) => `${row[variable]}`)

  useAsyncEffect(async () => {
    await dispatch(fetchWorkbook(fileName))
    setIsLoading(false)
  }, [dispatch, fileName])

  return (
    !isLoading && (
      <section className={classes.root}>
        <div className={classes.plot}>
          <Plot data={[{ name: variable, type: plotTypes[type], x: series }]} />
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
