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
import { constant } from 'fp-ts/function'
import { reduce, map } from 'fp-ts/ReadonlyNonEmptyArray'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { getCleanNumericalRow, getIndexedRow } from '@/features/sheet/selectors'
import CategoricalPlot from '@/pages/EDA/Variable/CategoricalPlot'
import NumericalPlot from '@/pages/EDA/Variable/NumericalPlot'
import { codebook } from '@/data'

import FlaggedDataGrid from './FlaggedDataGrid'
import BlankDataGrid from './BlankDataGrid'
import IncorrectDataGrid from './IncorrectDataGrid'
import SimpleDataGrid from '@/components/SimpleDataGrid'
import { just } from '@/lib/monads'
import { saveColumnState } from '@/features/columns/reducers'
import { saveSheetState } from '@/features/sheet/reducers'

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

// eslint-disable-next-line import/prefer-default-export
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

  const measurementType: VariableType = includes(type)([
    'whole_number',
    'interval',
  ])
    ? 'numerical'
    : 'categorical'

  const isCategorical = measurementType === 'categorical'

  useBeforeUnload(
    useCallback(() => {
      just(saveColumnState).pass()(dispatch)
      just(saveSheetState).pass()(dispatch)
    }, [dispatch]),
  )

  const summaryStatistics: SummaryStats[] = useMemo(
    () =>
      isCategorical
        ? [{ value: series.length, statistic: 'Count' }]
        : [
            { value: cleanNumericalSeries.length, statistic: 'Count' },
            {
              value: Math.min(
                ...cleanNumericalSeries.map(([value]) => value ?? 0),
              ),
              statistic: 'Min',
            },
            {
              value: Math.max(
                ...map(([value]) => value ?? '')(cleanNumericalSeries),
              ),
              statistic: 'Max',
            },
            {
              value:
                reduce((sum, [value]) => sum + value)(0)(cleanNumericalSeries) /
                cleanNumericalSeries.length,
              statistic: 'Mean',
            },
            {
              value: reduce((sum, [value]) => sum + value)(0)(
                cleanNumericalSeries,
              ),
              statistic: 'Sum',
            },
          ],
    [cleanNumericalSeries, isCategorical, series.length],
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
