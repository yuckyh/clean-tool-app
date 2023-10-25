/* eslint-disable import/prefer-default-export */
import { codebook } from '@/data'
import { setDataType } from '@/features/columns/reducers'
import { getSearchedPos } from '@/features/columns/selectors'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import CategoricalPlot from '@/pages/EDA/Variable/Plot/CategoricalPlot'
import NumericalPlot from '@/pages/EDA/Variable/Plot/NumericalPlot'
/* eslint-disable functional/functional-parameters */
import {
  Card,
  Field,
  Switch,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import * as IO from 'fp-ts/IO'
import { pipe } from 'fp-ts/function'
import * as S from 'fp-ts/string'
import { useParams } from 'react-router-dom'

import AllDataGrid from './DataGrid/All'
import IncorrectDataGrid from './DataGrid/Incorrect'
import BlankDataGrid from './DataGrid/Missing'
import SummaryDataGrid from './DataGrid/Summary'

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

export function Component() {
  const classes = useClasses()

  const params = useParams()

  const dispatch = useAppDispatch()

  const firstVisit = useAppSelector(({ sheet }) => sheet.visits[0] ?? '')

  const column = S.replace(/-/g, '_')(params.column ?? '')
  const visit = params.visit ?? firstVisit

  const pos = useAppSelector((state) => getSearchedPos(state, column, visit))
  const dataType = useAppSelector(({ columns }) => columns.dataTypes[pos] ?? '')

  const title = `${column}${visit && visit !== '1' ? `_${visit}` : ''}`

  const codebookVariable = codebook.find(({ name }) => column === name) ?? {
    category: '',
    description: '',
    name: '',
    type: '',
    unit: '',
  }
  const isUser = !codebookVariable.name

  const { unit } = codebookVariable

  const isCategorical = dataType === 'categorical'

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
                    pipe(
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
          <OutlierDataGrid column={column} title={title} visit={visit} />
        </div>
        <div className={classes.rows}>
          <BlankDataGrid column={column} title={title} visit={visit} />
        </div>
        <div className={classes.rows}>
          {!isCategorical && (
            <IncorrectDataGrid column={column} title={title} visit={visit} />
          )}
        </div>
      </div>
      <div className={classes.columns}>
        <div className={classes.rows}>
          <AllDataGrid column={column} title={title} visit={visit} />
        </div>
      </div>
    </section>
  )
}
