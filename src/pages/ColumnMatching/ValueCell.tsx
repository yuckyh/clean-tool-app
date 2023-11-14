import type { AppState } from '@/app/store'

import { useAppSelector } from '@/lib/hooks'
import { getOriginalColumn } from '@/selectors/columns/selectors'
import { makeStyles, shorthands, tokens } from '@fluentui/react-components'

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
interface Props {
  /**
   * The column index
   */
  pos: number
}

const selectOriginalColumn =
  ({ pos }: Readonly<Props>) =>
  (state: AppState) =>
    getOriginalColumn(state, pos)

/**
 * A cell in the {@link pages/ColumnMatching/ColumnsDataGrid ColumnsDataGrid} that displays the value of the original column
 * @param props - The component's props
 * @param props.pos - The column index
 * @returns The component object
 * @example
 */
export default function ValueCell(props: Readonly<Props>) {
  const classes = useClasses()

  const cell = useAppSelector(selectOriginalColumn(props))

  return <div className={classes.root}>{cell}</div>
}
