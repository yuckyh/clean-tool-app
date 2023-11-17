import { codebook } from '@/data'
import { equals } from '@/lib/fp'
import { kebabToSnake } from '@/lib/fp/string'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import CategoricalPlot from '@/pages/EDA/Variable/Plot/CategoricalPlot'
import NumericalPlot from '@/pages/EDA/Variable/Plot/NumericalPlot'
import { setDataType } from '@/reducers/matches'
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
import SummaryDataGrid from './DataGrid/SummaryDataGrid'
import {
  selectIncorrectSeries,
  selectMissingSeries,
  selectSuspectedSeries,
} from './DataGrid/selectors'
import {
  selectIsCategorical,
  selectSearchedPos,
  selectVisit,
} from './selectors'

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

  const seriesProps = { column, visit }

  const incorrectSeries = useAppSelector(selectIncorrectSeries(seriesProps))
  const missingSeries = useAppSelector(selectMissingSeries(seriesProps))
  const suspectedSeries = useAppSelector(selectSuspectedSeries(seriesProps))

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
          <FlagDataGrid
            column={column}
            emptyText="There are no suspected outliers."
            reason="outlier"
            series={suspectedSeries}
            subtitleText="The data shown here are suspected outliers based on the bell curve distribution."
            titleText="Suspected Outliers"
            visit={visit}
          />
        </div>
        <div className={classes.rows}>
          <FlagDataGrid
            column={column}
            emptyText="There are no blank data found."
            reason="missing"
            series={missingSeries}
            subtitleText="The data shown here are the most common blank values that could be invalidly blank."
            titleText="Blank Data"
            visit={visit}
          />
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
