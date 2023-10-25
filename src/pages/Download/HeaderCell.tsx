import { makeStyles, shorthands, tokens } from '@fluentui/react-components'

const useClasses = makeStyles({
  root: {
    ...shorthands.padding(0, tokens.spacingHorizontalS),
    display: 'flex',
    fontWeight: 'bold',
    justifyContent: 'center',
    width: '100%',
  },
})

interface Props {
  header: string
}

export default function HeaderCell({ header }: Props) {
  const classes = useClasses()

  return <div className={classes.root}>{header}</div>
}
