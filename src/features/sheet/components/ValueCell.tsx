import type { AppState } from '@/app/store'

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
 * @returns
 * @example
 */
const selectCell =
  ({ col, row }: Readonly<Props>) =>
  (state: AppState) =>
    getCell(state, col, row)

/**
 *
 * @param props
 * @returns
 * @example
 */
export default function ValueCell(props: Readonly<Props>) {
  const classes = useClasses()

  const cell = useAppSelector(selectCell(props))

  return <div className={classes.root}>{cell}</div>
}
