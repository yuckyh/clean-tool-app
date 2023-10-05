import { makeStyles, Subtitle1, Caption1 } from '@fluentui/react-components'

const useClasses = makeStyles({
  root: {
    flexDirection: 'column',
    display: 'flex',
  },
})

interface Props {
  subtitle: string
  header: string
}

const HeaderCell = ({ subtitle, header }: Props) => {
  const classes = useClasses()

  return (
    <div className={classes.root}>
      <Subtitle1>{header}</Subtitle1>
      <Caption1>{subtitle}</Caption1>
    </div>
  )
}

export default HeaderCell
