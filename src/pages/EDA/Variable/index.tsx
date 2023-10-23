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
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { pipe } from 'fp-ts/function'
import * as RA from 'fp-ts/ReadonlyArray'
import { useAppSelector } from '@/lib/hooks'
import CategoricalPlot from '@/pages/EDA/Variable/CategoricalPlot'
import NumericalPlot from '@/pages/EDA/Variable/NumericalPlot'
import { codebook } from '@/data'

import { console } from 'fp-ts'
import * as S from 'fp-ts/string'
import IncorrectDataGrid from './IncorrectDataGrid'
import BlankDataGrid from './BlankDataGrid'
import FlaggedDataGrid from './FlaggedDataGrid'
import SummaryTable from './SummaryTable'

type VariableType = Extract<Property<typeof variableType>, string>

const variableType = ['numerical', 'categorical'] as const

const useClasses = makeStyles({
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
  rows: {
    rowGap: tokens.spacingVerticalXL,
    flexDirection: 'column',
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

  const params = useParams()

  const firstVisit = useAppSelector(({ sheet }) => sheet.visits[0] ?? '')

  const column = S.replace(/-/g, '_')(params.column ?? '')
  const visit = params.visit ?? firstVisit

  const title = `${column}${visit && visit !== '1' ? `_${visit}` : ''}`

  const codebookVariable = codebook.find(({ name }) => column === name) ?? {
    description: '',
    category: '',
    name: '',
    type: '',
    unit: '',
  }
  const isUser = !codebookVariable.name

  console.log(isUser)

  const { type, unit } = codebookVariable

  const measurementType: VariableType = pipe(
    ['whole_number', 'interval'] as const,
    pipe(type, S.includes, RA.some),
  )
    ? 'numerical'
    : 'categorical'

  const isCodebookCategorical = measurementType === 'categorical'

  const [isUserCategorical, setIsUserCategorical] = useState(false)

  const isCategorical = isUser ? isUserCategorical : isCodebookCategorical

  return (
    <section className={classes.root}>
      <div className={classes.columns}>
        <div className={classes.plot}>
          <Card className={classes.card} size="large">
            {isUser && (
              <Field>
                <Switch
                  onChange={({ target }) => {
                    setIsUserCategorical(target.checked)
                    return undefined
                  }}
                  label={isUserCategorical ? 'Categorical' : 'Numerical'}
                  checked={isUserCategorical}
                  labelPosition="after"
                />
              </Field>
            )}
            {isCategorical ? (
              <CategoricalPlot variable={title} column={column} visit={visit} />
            ) : (
              <NumericalPlot
                variable={title}
                column={column}
                visit={visit}
                unit={unit}
              />
            )}
          </Card>
        </div>
        <div className={classes.options}>
          <SummaryTable
            isCategorical={isCategorical}
            column={column}
            visit={visit}
          />
        </div>
      </div>
      <div className={classes.columns}>
        <div className={classes.rows}>
          <FlaggedDataGrid column={column} visit={visit} title={title} />
        </div>
        <div className={classes.rows}>
          <BlankDataGrid column={column} visit={visit} title={title} />
        </div>
        <div className={classes.rows}>
          {!isCategorical && (
            <IncorrectDataGrid column={column} visit={visit} title={title} />
          )}
        </div>
      </div>
      <div className="columns">{/* <SimpleDataGrid /> */}</div>
    </section>
  )
}
