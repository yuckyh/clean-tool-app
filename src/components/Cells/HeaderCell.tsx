import { Caption1, Subtitle1, makeStyles } from '@fluentui/react-components'

const useClasses = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
})

interface Props {
  header: string
  subtitle: string
}

const HeaderCell = ({ header, subtitle }: Props) => {
  const classes = useClasses()
  return (
    <div className={classes.root}>
      <Subtitle1>{header}</Subtitle1>
      <Caption1>{subtitle}</Caption1>
    </div>
  )
}

export default HeaderCell
