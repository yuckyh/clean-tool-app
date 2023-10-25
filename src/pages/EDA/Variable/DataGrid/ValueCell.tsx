import { makeStyles, shorthands, tokens } from '@fluentui/react-components'

const useClasses = makeStyles({
  root: {
    ...shorthands.padding(0, tokens.spacingHorizontalS),
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
})

interface Props {
  value: number | string
}

export default function ValueCell({ value }: Props) {
  const classes = useClasses()

  return <div className={classes.root}>{value}</div>
}
