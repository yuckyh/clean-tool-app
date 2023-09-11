import {
  Button,
  Spinner,
  Subtitle1,
  Title1,
  makeStyles,
  shorthands,
} from '@fluentui/react-components'
import { useWorkbookWorker } from '@/hooks'
import { Suspense, lazy } from 'react'

const useClasses = makeStyles({
  root: {
    display: 'grid',
    width: '70%',
    ...shorthands.margin(0, 'auto'),
    ...shorthands.gap(0, '8px'),
  },
})

const ColumnsDataGrid = lazy(() => import('@/components/ColumnsDataGrid'))

// TODO: Unique column replacement validation

export const Component = () => {
  useWorkbookWorker()
  const classes = useClasses()

  return (
    <section className={classes.root}>
      <Title1>Column Matching</Title1>

      <Suspense
        fallback={
          <Spinner
            size="huge"
            labelPosition="below"
            label={<Subtitle1>Matching columns...</Subtitle1>}
          />
        }>
        <ColumnsDataGrid />
        <div>
          <Button appearance="primary">Done</Button>
        </div>
      </Suspense>
    </section>
  )
}

Component.displayName = 'ColumnMatching'
