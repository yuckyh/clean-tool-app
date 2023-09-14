import { makeStyles, Subtitle1, Caption1 } from '@fluentui/react-components'

const useClasses = makeStyles({
  headerCell: {
    display: 'flex',
    flexDirection: 'column',
  },
})

const HeaderCell = ({
  header,
  subtitle,
}: {
  header: string
  subtitle: string
}) => {
  const classes = useClasses()
  return (
    <div className={classes.headerCell}>
      <Subtitle1>{header}</Subtitle1>
      <Caption1>{subtitle}</Caption1>
    </div>
  )
}

export default HeaderCell
