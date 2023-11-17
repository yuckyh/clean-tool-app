/**
 * @file This file contains the value cell component for the matches data grid.
 * @module components/matches/ValueCell
 */

import { useAppSelector } from '@/lib/hooks'
import { makeStyles, shorthands, tokens } from '@fluentui/react-components'

import { selectOriginalColumn } from './selectors'

const useClasses = makeStyles({
  root: {
    alignItems: 'center',
    display: 'flex',
    width: '100%',
    ...shorthands.padding(0, tokens.spacingHorizontalS),
  },
})

/**
 * The props for {@link ValueCell}
 */
export interface Props {
  /**
   * The column index
   */
  pos: number
}

/**
 * A cell in the {@link pages/ColumnMatching/ColumnsDataGrid ColumnsDataGrid} that displays the value of the original column
 * @param props - The {@link Props props} for the component.
 * @param props.pos - The column index
 * @returns The component object
 * @category Component
 * @example
 * ```tsx
 *  <ValueCell pos={pos} />
 * ```
 */
export default function ValueCell(props: Readonly<Props>) {
  const classes = useClasses()

  const cell = useAppSelector(selectOriginalColumn(props))

  return <div className={classes.root}>{cell}</div>
}
