import type * as CellItem from '@/lib/fp/CellItem'

import { makeStyles, shorthands, tokens } from '@fluentui/react-components'

const useClasses = makeStyles({
  root: {
    ...shorthands.padding(0, tokens.spacingHorizontalS),
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
})

/**
 *
 */
interface Props {
  /**
   *
   */
  value: CellItem.Value
}

/**
 *
 * @param props - The {@link Props props} for the component.
 * @param props.value
 * @returns
 * @example
 */
export default function ValueCell({ value }: Readonly<Props>) {
  const classes = useClasses()

  return <div className={classes.root}>{value}</div>
}
