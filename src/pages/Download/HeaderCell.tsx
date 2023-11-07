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

export interface Props {
  header: string
}

/**
 *
 * @param props
 * @param props.header
 */
export default function HeaderCell({ header }: Readonly<Props>) {
  const classes = useClasses()

  return <div className={classes.root}>{header}</div>
}
