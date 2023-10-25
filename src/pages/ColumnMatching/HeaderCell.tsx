import {
  Caption1,
  Subtitle1,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'

const useClasses = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.padding(0, tokens.spacingHorizontalS),
    justifyContent: 'center',
  },
})

interface Props {
  header: string
  subtitle: string
}

export default function HeaderCell({ header, subtitle }: Props) {
  const classes = useClasses()

  return (
    <div className={classes.root}>
      <Subtitle1>{header}</Subtitle1>
      <Caption1>{subtitle}</Caption1>
    </div>
  )
}
