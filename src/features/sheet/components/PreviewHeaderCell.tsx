import { makeStyles, tokens } from '@fluentui/react-components'
import { useAppSelector } from '@/lib/hooks'

import { getFormattedColumn } from '../../columns/selectors'
import { getColumn } from '../selectors'

interface Props {
  isOriginal: boolean
  pos: number
}

const useClasses = makeStyles({
  categoricalHeader: {
    backgroundColor: tokens.colorPalettePurpleBackground2,
  },
  numericalHeader: {
    backgroundColor: tokens.colorPaletteBerryBackground2,
  },
  columnHeader: {
    fontWeight: 'bold',
  },
})

export default function PreviewHeaderCell({ isOriginal, pos }: Props) {
  const classes = useClasses()

  const column = useAppSelector((state) =>
    isOriginal ? getColumn(state, pos) : getFormattedColumn(state, pos),
  )

  return <div className={classes.columnHeader}>{column}</div>
}
