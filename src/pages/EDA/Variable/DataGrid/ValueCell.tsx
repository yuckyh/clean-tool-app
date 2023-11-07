import { makeStyles, shorthands, tokens } from '@fluentui/react-components'

const useClasses = makeStyles({
  root: {
    ...shorthands.padding(0, tokens.spacingHorizontalS),
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
})

export interface Props {
  value: number | string
}

/**
 *
 * @param props
 * @param props.value
 */
export default function ValueCell({ value }: Readonly<Props>) {
  const classes = useClasses()

  return <div className={classes.root}>{value}</div>
}
