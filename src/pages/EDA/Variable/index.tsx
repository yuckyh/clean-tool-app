/* eslint-disable import/prefer-default-export */
/* eslint-disable functional/functional-parameters */
import {
  makeStyles,
  shorthands,
  tokens,
  Switch,
  Field,
  Card,
} from '@fluentui/react-components'
import { useBeforeUnload, useParams } from 'react-router-dom'
import { useCallback, useState, useMemo } from 'react'
import { flow, pipe } from 'fp-ts/function'
import * as RA from 'fp-ts/ReadonlyArray'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
  getIndexedRowIncorrects,
  getCleanNumericalRow,
  getIndexedRow,
} from '@/features/sheet/selectors'
import CategoricalPlot from '@/pages/EDA/Variable/CategoricalPlot'
import NumericalPlot from '@/pages/EDA/Variable/NumericalPlot'
import { codebook } from '@/data'

import { saveColumnState } from '@/features/columns/reducers'
import { saveSheetState } from '@/features/sheet/reducers'
import * as S from 'fp-ts/string'
import { console } from 'fp-ts'
import * as IO from 'fp-ts/IO'
import IncorrectDataGrid from './IncorrectDataGrid'
import BlankDataGrid from './BlankDataGrid'
import FlaggedDataGrid from './FlaggedDataGrid'
import SummaryTable from './SummaryTable'

type VariableType = Extract<Property<typeof variableType>, string>

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
    width: '80%',
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

export function Component() {
  const classes = useClasses()

  const dispatch = useAppDispatch()

  const params = useParams()

  const firstVisit = useAppSelector(({ sheet }) => sheet.visits[0] ?? '')

  // const [isLoading, stopLoading] = useLoadingTransition()

  const column = S.replace(/-/g, '_')(params.column ?? '')
  const visit = params.visit ?? firstVisit

  const searchParams = useMemo(() => [column, visit] as const, [column, visit])

  const series = useAppSelector((state) =>
    getIndexedRow(state, ...searchParams),
  )
  const cleanNumericalSeries = useAppSelector((state) =>
    getCleanNumericalRow(state, ...searchParams),
  )

  const incorrectsSeries = useAppSelector((state) =>
    getIndexedRowIncorrects(state, ...searchParams),
  )

  // const blanksSeries = useAppSelector((state) =>
  //   getRowBlanks(state, ...searchParams),
  // )

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
    RA.some(S.includes(type)),
  )
    ? 'numerical'
    : 'categorical'

  const isCategorical = measurementType === 'categorical'

  useBeforeUnload(
    useCallback(() => {
      return pipe(
        [saveColumnState, saveSheetState] as const,
        RA.map(
          flow(
            (x) => x(),
            (x) => dispatch(x),
            IO.of,
          ),
        ),
        IO.sequenceArray,
      )()
    }, [dispatch]),
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
          <SummaryTable
            numericalSeries={cleanNumericalSeries}
            isCategorical={isCategorical}
            categoricalSeries={series}
          />
        </div>
      </div>
      <div className={classes.columns}>
        <div className={classes.rows}>
          <FlaggedDataGrid series={series} title={title} />
        </div>
        <div className={classes.rows}>
          <BlankDataGrid column={column} visit={visit} title={title} />
        </div>
        <div className={classes.rows}>
          {!isCategorical && (
            <IncorrectDataGrid series={incorrectsSeries} title={title} />
          )}
        </div>
      </div>
      <div className="columns">{/* <SimpleDataGrid /> */}</div>
    </section>
  )
}
