/**
 * @file This file contains the value cell component for the EDA data grid.
 * @module pages/EDA/Variable/DataGrid/ValueCell
 */

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
 * A cell in the {@link pages/EDA/Variable/DataGrid/SummaryDataGrid SummaryDataGrid}.
 * @param props - The {@link Props props} for the component.
 * @param props.value - The value to display
 * @returns The component object.
 * @example
 * ```tsx
 *  <ValueCell value={value} />
 * ```
 */
export default function ValueCell({ value }: Readonly<Props>) {
  const classes = useClasses()

  return <div className={classes.root}>{value}</div>
}
