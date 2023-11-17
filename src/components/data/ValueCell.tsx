/**
 * @file This file contains the value cell component for the preview data grid.
 * @module components/data/ValueCell
 */

import { useAppSelector } from '@/lib/hooks'
import { makeStyles, shorthands, tokens } from '@fluentui/react-components'

import { selectCell } from './selectors'

const useClasses = makeStyles({
  root: {
    ...shorthands.padding(0, tokens.spacingHorizontalS),
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
})

/**
 * The props for {@link ValueCell}.
 */
interface Props {
  /**
   * The column position of the cell.
   */
  col: number
  /**
   * The row position of the cell.
   */
  row: number
}

/**
 * This function renders the value cell for the preview data grid.
 * @param props - The {@link Props props} for the component.
 * @returns The component object.
 * @example
 * ```tsx
 *  <ValueCell col={col} row={row} />
 * ```
 */
export default function ValueCell(props: Readonly<Props>) {
  const classes = useClasses()

  const cell = useAppSelector(selectCell(props))

  return <div className={classes.root}>{cell}</div>
}
