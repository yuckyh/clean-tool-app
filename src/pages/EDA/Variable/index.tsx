/* eslint-disable import/prefer-default-export */
/* eslint-disable functional/functional-parameters */
import type {
  DataGridCellFocusMode,
  TableColumnDefinition,
  TableColumnId,
} from '@fluentui/react-components'
import {
  createTableColumn,
  CardHeader,
  makeStyles,
  shorthands,
  Title1,
  tokens,
  Switch,
  Field,
  Card,
} from '@fluentui/react-components'
import { useBeforeUnload, useParams } from 'react-router-dom'
import { useCallback, useState, useMemo } from 'react'
import { constant, pipe } from 'fp-ts/function'
import { reduce, some, map } from 'fp-ts/ReadonlyArray'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { getCleanNumericalRow, getIndexedRow } from '@/features/sheet/selectors'
import CategoricalPlot from '@/pages/EDA/Variable/CategoricalPlot'
import NumericalPlot from '@/pages/EDA/Variable/NumericalPlot'
import { codebook } from '@/data'

import SimpleDataGrid from '@/components/SimpleDataGrid'
import { saveColumnState } from '@/features/columns/reducers'
import { saveSheetState } from '@/features/sheet/reducers'
import { includes } from 'fp-ts/string'
import { console } from 'fp-ts'
import IO from 'fp-ts/IO'
import IncorrectDataGrid from './IncorrectDataGrid'
import BlankDataGrid from './BlankDataGrid'
import FlaggedDataGrid from './FlaggedDataGrid'

type VariableType = Extract<Property<typeof variableType>, string>

interface SummaryStats {
  statistic: string
  value: number
}

const variableType = ['numerical', 'categorical'] as const

const useClasses = makeStyles({
  rows: {
    rowGap: tokens.spacingVerticalXL,
    // justifyContent: 'space-between',
    flexDirection: 'column',
    display: 'flex',
    width: '100%',
  },
  card: {
    height: '100%',
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
    rowGap: tokens.spacingVerticalXL,
    flexDirection: 'column',
    display: 'flex',
    width: '100%',
  },
  columns: {
    columnGap: tokens.spacingVerticalXL,
    display: 'flex',
    width: '100%',
  },
  plot: {
    minHeight: '500px',
    flexBasis: '0',
    flexShrink: 2,
    flexGrow: 2,
  },
  options: {
    flexBasis: '0',
    flexShrink: 1,
    flexGrow: 1,
  },
})

const cellFocusMode: (
  tableColumnId: TableColumnId,
) => DataGridCellFocusMode = () => 'none'

export function Component() {
  const classes = useClasses()

  const dispatch = useAppDispatch()

  const params = useParams()

  const firstVisit = useAppSelector(({ sheet }) => sheet.visits[0] ?? '')

  // const [isLoading, stopLoading] = useLoadingTransition()

  const column = params.column?.replace(/_/g, '-') ?? ''
  const visit = params.visit ?? firstVisit

  const series = useAppSelector((state) => getIndexedRow(state, column, visit))
  const cleanNumericalSeries = useAppSelector((state) =>
    getCleanNumericalRow(state, column, visit),
  )

  const title = `${column}${visit && visit !== '1' ? `_${visit}` : ''}`

  const codebookVariable = codebook.find(({ name }) => column === name) ?? {
    description: '',
    category: '',
    name: '',
    type: '',
    unit: '',
  }
  const isCustom = !codebookVariable.name

  console.log(isCustom)

  const { type, unit } = codebookVariable

  const measurementType: VariableType = pipe(
    ['whole_number', 'interval'] as const,
    some(includes(type)),
  )
    ? 'numerical'
    : 'categorical'

  const isCategorical = measurementType === 'categorical'

  useBeforeUnload(
    useCallback(() => {
      return pipe(
        saveColumnState,
        (x) => dispatch(x),
        saveSheetState,
        (x) => dispatch(x),
        IO.of,
      )()
    }, [dispatch]),
  )

  const dataSum = useMemo(
    () =>
      pipe(
        cleanNumericalSeries,
        reduce(0, (sum, [, value]) => sum + value),
      ),
    [cleanNumericalSeries],
  )

  const summaryStatistics: readonly SummaryStats[] = useMemo(
    () =>
      isCategorical
        ? [{ value: series.length, statistic: 'Count' }]
        : [
            { value: cleanNumericalSeries.length, statistic: 'Count' },
            {
              value: Math.min(
                ...cleanNumericalSeries.map(([, value]) => value),
              ),
              statistic: 'Min',
            },
            {
              value: Math.max(
                ...pipe(
                  cleanNumericalSeries,
                  map(([, value]) => value),
                ),
              ),
              statistic: 'Max',
            },
            {
              value: dataSum / cleanNumericalSeries.length,
              statistic: 'Mean',
            },
            {
              statistic: 'Sum',
              value: dataSum,
            },
          ],
    [cleanNumericalSeries, isCategorical, series.length, dataSum],
  )

  const columnDefinition: TableColumnDefinition<SummaryStats>[] = useMemo(
    () => [
      createTableColumn({
        renderCell: ({ statistic }) => statistic,
        renderHeaderCell: constant('Statistic'),
        columnId: 'statistic',
      }),
      createTableColumn({
        renderHeaderCell: constant('Value'),
        renderCell: ({ value }) => value,
        columnId: 'value',
      }),
    ],
    [],
  )

  const [isCustomCategorical, setIsCustomCategorical] = useState(false)

  return (
    <section className={classes.root}>
      <div className={classes.columns}>
        <div className={classes.plot}>
          <Card className={classes.card} size="large">
            {isCustom && (
              <Field>
                <Switch
                  onChange={({ target }) => {
                    setIsCustomCategorical(target.checked)
                    return undefined
                  }}
                  label={isCustomCategorical ? 'Categorical' : 'Numerical'}
                  checked={isCustomCategorical}
                  labelPosition="after"
                />
              </Field>
            )}
            {(isCustom ? isCustomCategorical : isCategorical) ? (
              <CategoricalPlot variable={title} series={series} />
            ) : (
              <NumericalPlot
                series={cleanNumericalSeries}
                variable={title}
                unit={unit}
              />
            )}
          </Card>
        </div>
        <div className={classes.options}>
          {/* Summary Statistics */}
          <Card className={classes.card} size="large">
            <CardHeader header={<Title1>Summary Statistics</Title1>} />
            <SimpleDataGrid
              cellFocusMode={cellFocusMode}
              columns={columnDefinition}
              items={summaryStatistics}
            />
          </Card>
        </div>
      </div>
      <div className={classes.columns}>
        <div className={classes.rows}>
          <FlaggedDataGrid series={series} title={title} />
        </div>
        <div className={classes.rows}>
          <BlankDataGrid column={column} visit={visit} />
        </div>
        <div className={classes.rows}>
          {!isCategorical && (
            <IncorrectDataGrid column={column} visit={visit} />
          )}
        </div>
      </div>
      <div className="columns">{/* <SimpleDataGrid /> */}</div>
    </section>
  )
}
