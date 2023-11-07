import { useAppSelector } from '@/lib/hooks'
import { makeStyles, shorthands, tokens } from '@fluentui/react-components'

import { getCell } from '../selectors'

const useClasses = makeStyles({
  root: {
    ...shorthands.padding(0, tokens.spacingHorizontalS),
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
})

interface Props {
  col: number
  row: number
}

/**
 *
 * @param props
 * @param props.col
 * @param props.row
 * @example
 */
export default function ValueCell({ col, row }: Readonly<Props>) {
  const classes = useClasses()

  const cell = useAppSelector((state) => getCell(state, col, row))

  return <div className={classes.root}>{cell}</div>
}
