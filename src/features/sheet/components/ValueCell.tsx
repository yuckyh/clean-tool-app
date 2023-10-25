import { useAppSelector } from '@/lib/hooks'
import { makeStyles, shorthands, tokens } from '@fluentui/react-components'

import { getColumn } from '../selectors'

interface Props {
  col: number
  row: number
}

const useClasses = makeStyles({
  root: { ...shorthands.padding(0, tokens.spacingHorizontalS) },
})

export default function ValueCell({ col, row }: Props) {
  const classes = useClasses()
  const column = useAppSelector((state) => getColumn(state, col))

  const cell = useAppSelector(({ sheet }) => sheet.data[row]?.[column])

  return <div className={classes.root}>{cell}</div>
}
