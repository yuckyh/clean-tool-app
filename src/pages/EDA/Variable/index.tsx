/* eslint-disable
  functional/functional-parameters
*/
import type { AppState } from '@/app/store'

import { codebook } from '@/data'
import { equals } from '@/lib/fp'
import { kebabToSnake } from '@/lib/fp/string'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import CategoricalPlot from '@/pages/EDA/Variable/Plot/CategoricalPlot'
import NumericalPlot from '@/pages/EDA/Variable/Plot/NumericalPlot'
import { setDataType } from '@/reducers/matches'
import { getFirstVisit } from '@/selectors/data/visits'
import { getSearchedPos } from '@/selectors/matches'
import { getSearchedDataType } from '@/selectors/matches/dataTypes'
import {
  Card,
  Field,
  Switch,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import * as IO from 'fp-ts/IO'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'
import * as S from 'fp-ts/string'
import { useParams } from 'react-router-dom'

import AllDataGrid from './DataGrid/AllDataGrid'
import FlagDataGrid from './DataGrid/FlagDataGrid'
import IncorrectDataGrid from './DataGrid/IncorrectDataGrid'
import BlankDataGrid from './DataGrid/MissingDataGrid'
import OutlierDataGrid from './DataGrid/OutlierDataGrid'
import SummaryDataGrid from './DataGrid/SummaryDataGrid'
import { selectIncorrectSeries } from './DataGrid/selectors'

const useClasses = makeStyles({
  actions: {
    columnGap: tokens.spacingVerticalS,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  card: {
    height: '100%',
    width: '100%',
    ...shorthands.margin(0, 'auto'),
    ...shorthands.padding(tokens.spacingHorizontalXXXL, '5%'),
  },
  columns: {
    columnGap: tokens.spacingVerticalXL,
    display: 'flex',
    width: '100%',
  },
  options: {
    flexBasis: '0',
    flexGrow: 1,
    flexShrink: 1,
  },
  plot: {
    flexBasis: '0',
    flexGrow: 2,
    flexShrink: 2,
    minHeight: '500px',
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalXL,
    width: '80%',
  },
  rows: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalXL,
    width: '100%',
  },
})

/**
 *
 * @param column
 * @param visit
 * @returns
 * @example
 */
const selectSearchedPos =
  (column: string, visit: string) => (state: AppState) =>
    getSearchedPos(state, column, visit)

/**
 *
 * @param column
 * @param visit
 * @returns
 * @example
 */
const selectIsCategorical =
  (column: string, visit: string) => (state: AppState) =>
    getSearchedDataType(state, column, visit) === 'categorical'

/**
 *
 * @param visit
 * @returns
 * @example
 */
const selectVisit = (visit?: string) => (state: AppState) =>
  visit ?? getFirstVisit(state)

/**
 *
 * @returns
 * @example
 */
export default function Variable() {
  const classes = useClasses()

  const params = useParams()

  const dispatch = useAppDispatch()

  const column = f.pipe(
    params.column,
    O.fromNullable,
    O.map(kebabToSnake),
    O.getOrElse(() => ''),
  )
  const visit = useAppSelector(selectVisit(params.visit))

  const pos = useAppSelector(selectSearchedPos(column, visit))
  const isCategorical = useAppSelector(selectIsCategorical(column, visit))

  const title = `${column}${visit && visit !== '1' ? `_${visit}` : ''}`

  const codebookVariable = f.pipe(
    codebook,
    RA.findFirst(({ name }) => equals(S.Eq)(name)(column)),
    O.map(({ name, unit }) => ({
      name,
      unit,
    })),
    O.getOrElse(() => ({
      name: '',
      unit: '',
    })),
  )

  const { name, unit } = codebookVariable

  const isUser = !name

  const incorrectSeries = useAppSelector(
    selectIncorrectSeries({ column, visit }),
  )

  return (
    <section className={classes.root}>
      <div className={classes.columns}>
        <div className={classes.plot}>
          <Card className={classes.card} size="large">
            {isUser && (
              <Field>
                <Switch
                  checked={isCategorical}
                  label={isCategorical ? 'Categorical' : 'Numerical'}
                  labelPosition="after"
                  onChange={({ target }) => {
                    f.pipe(
                      {
                        dataType: target.checked ? 'categorical' : 'numerical',
                        pos,
                      } as const,
                      setDataType,
                      (x) => dispatch(x),
                      IO.of,
                    )()
                    return undefined
                  }}
                />
              </Field>
            )}
            {isCategorical ? (
              <CategoricalPlot column={column} variable={title} visit={visit} />
            ) : (
              <NumericalPlot
                column={column}
                unit={unit}
                variable={title}
                visit={visit}
              />
            )}
          </Card>
        </div>
        <div className={classes.options}>
          <SummaryDataGrid
            column={column}
            isCategorical={isCategorical}
            visit={visit}
          />
        </div>
      </div>
      <div className={classes.columns}>
        <div className={classes.rows}>
          <OutlierDataGrid column={column} visit={visit} />
        </div>
        <div className={classes.rows}>
          <BlankDataGrid column={column} visit={visit} />
        </div>
        <div className={classes.rows}>
          {!isCategorical && (
            <FlagDataGrid
              column={column}
              emptyText="There are no incorrectly formatted data found."
              reason="incorrect"
              series={incorrectSeries}
              subtitleText="The data shown here are data that might be incorrectly formatted."
              titleText="Incorrect Data"
              visit={visit}
            />
          )}
        </div>
      </div>
      <div className={classes.columns}>
        <div className={classes.rows}>
          <AllDataGrid column={column} visit={visit} />
        </div>
      </div>
    </section>
  )
}
