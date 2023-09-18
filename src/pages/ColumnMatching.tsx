import ColumnsDataGrid from '@/components/ColumnsDataGrid'
import {
  Title1,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'

const useClasses = makeStyles({
  root: {
    display: 'grid',
    width: '70%',
    ...shorthands.margin(0, 'auto'),
    ...shorthands.gap(0, tokens.spacingVerticalS),
  },
})

export const Component = () => {
  const classes = useClasses()

  return (
    <section className={classes.root}>
      <Title1>Column Matching</Title1>

      <ColumnsDataGrid />
    </section>
  )
}

Component.displayName = 'ColumnMatching'
