import Plot from '@/components/Plot'
import { codebook } from '@/data'
import { getFormattedData } from '@/features/sheetSlice'
import { useAppSelector } from '@/lib/hooks'
import { slugToSnake } from '@/lib/string'
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Dropdown,
  Field,
  Input,
  Option,
  Title1,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

type Measurement = Extract<Property<typeof measurements>, string>

type PlotType = Extract<Property<typeof plotTypes>, string>

type PlotTypeMap = Record<Measurement, PlotType[]>

const measurements = [
  'categorical',
  'continuous',
  'discrete',
  'ordinal',
] as const

// TODO: Hover show sno
// TODO: data type detection
// Continuous box plot
// Categorical bar plot

const plotTypes = ['bar', 'box', 'histogram', 'pie', 'violin'] as const

const plotTypeMap: PlotTypeMap = {
  categorical: ['bar', 'pie'],
  continuous: ['box', 'histogram', 'violin'],
  discrete: ['box', 'histogram', 'pie'],
  ordinal: ['box', 'histogram', 'pie'],
}

interface VariableOptions {
  measurement: Measurement
  plotType: PlotType
}

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
  root: {
    display: 'grid',
    gridAutoFlow: 'column',
    width: '80%',
    ...shorthands.margin(0, 'auto'),
    ...shorthands.gap(0, tokens.spacingVerticalS),
  },
})

export const Component = () => {
  const params = useParams()
  const data = useAppSelector(getFormattedData)

  const classes = useClasses()
  const [options, setOptions] = useState<VariableOptions>({
    measurement: measurements[0],
    plotType: plotTypeMap[measurements[0]][0] ?? 'box',
  })
  const [showPlot, setShowPlot] = useState(false)

  const variable = slugToSnake(params.variable ?? '')
  console.log(Object.keys(data[0] ?? {}))

  console.log(variable)

  const series = data.map((row) => row[variable])

  // console.log(Array.from(new Set(codebook.map(({ type }) => type))))
  // console.log(Array.from(new Set(codebook.map(({ unit }) => unit))))
  console.log(series)

  return (
    <section className={classes.root}>
      <section>
        {showPlot ? (
          <Plot data={[{ type: options.plotType, x: series }]} />
        ) : (
          'There is no plot yet'
        )}
      </section>
      <section>
        <Card className={classes.card} size="large">
          <CardHeader header={<Title1>Plot Options</Title1>} />
          <Field label="Variable type">
            <Dropdown
              appearance="filled-darker"
              onOptionSelect={(e, { optionValue }) => {
                setOptions((options) => ({
                  measurement: optionValue as Measurement,
                  plotType:
                    (Object.keys(plotTypeMap).includes(options.measurement)
                      ? options.plotType
                      : plotTypeMap[optionValue as Measurement][0]) ?? 'box',
                }))
              }}
              selectedOptions={[options.measurement]}
              value={options.measurement}>
              {measurements.map((measurement) => (
                <Option key={measurement} value={measurement}>
                  {measurement}
                </Option>
              ))}
            </Dropdown>
          </Field>
          <Field label="Plot type">
            <Dropdown
              appearance="filled-darker"
              onOptionSelect={(e, { optionValue }) => {
                setOptions((options) => ({
                  ...options,
                  plotType: optionValue as PlotType,
                }))
              }}
              selectedOptions={[options.plotType]}
              value={options.plotType}>
              {plotTypeMap[options.measurement].map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Dropdown>
          </Field>
          {options.plotType === 'histogram' && (
            <Field label="Number of bins">
              <Input appearance="filled-darker" type="number" />
            </Field>
          )}
          {options.measurement !== 'categorical' && (
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
                <Button
                  appearance="primary"
                  onClick={() => {
                    setShowPlot(true)
                  }}>
                  Plot
                </Button>
              </div>
            }
          />
        </Card>
      </section>
    </section>
  )
}

Component.displayName = 'Variable'
