import { Title1, makeStyles, shorthands } from '@fluentui/react-components'
import { useWorkbookWorker } from '@/hooks'
import ColumnsDataGrid from '@/components/ColumnsDataGrid'

const useClasses = makeStyles({
  root: {
    display: 'grid',
    width: '70%',
    ...shorthands.margin(0, 'auto'),
    ...shorthands.gap(0, '8px'),
  },
})

export const Component = () => {
  useWorkbookWorker()
  const classes = useClasses()

  return (
    <section className={classes.root}>
      <Title1>Column Matching</Title1>

      <ColumnsDataGrid />
    </section>
  )
}

Component.displayName = 'ColumnMatching'
