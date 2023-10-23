import {
  makeStyles,
  shorthands,
  Subtitle1,
  Caption1,
  tokens,
} from '@fluentui/react-components'

const useClasses = makeStyles({
  root: {
    flexDirection: 'column',
    display: 'flex',
    ...shorthands.padding(0, tokens.spacingHorizontalS),
  },
})

interface Props {
  subtitle: string
  header: string
}

export default function HeaderCell({ subtitle, header }: Props) {
  const classes = useClasses()

  return (
    <div className={classes.root}>
      <Subtitle1>{header}</Subtitle1>
      <Caption1>{subtitle}</Caption1>
    </div>
  )
}
