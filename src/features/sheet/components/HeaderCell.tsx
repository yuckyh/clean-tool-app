import { useAppSelector } from '@/lib/hooks'
import {
  makeStyles,
  mergeClasses,
  shorthands,
  tokens,
} from '@fluentui/react-components'

import { getDataType, getFormattedColumn } from '../../columns/selectors'
import { getColumn } from '../selectors'

interface Props {
  isOriginal: boolean
  pos: number
}

const useClasses = makeStyles({
  categoricalHeader: {
    backgroundColor: tokens.colorBrandBackground,
  },
  numericalHeader: {
    backgroundColor: tokens.colorPaletteRedBackground3,
  },
  root: {
    alignItems: 'center',
    display: 'flex',
    fontWeight: 'bold',
    minHeight: '44px',
    textAlign: 'center',
    width: '100%',
    ...shorthands.padding(0, tokens.spacingHorizontalS),
    justifyContent: 'center',
  },
})

export default function HeaderCell({ isOriginal, pos }: Props) {
  const classes = useClasses()

  const column = useAppSelector((state) =>
    isOriginal ? getColumn(state, pos) : getFormattedColumn(state, pos),
  )

  const dataType = useAppSelector((state) => getDataType(state, pos))

  const isCategorical = dataType === 'categorical'

  const styleClass =
    classes[isCategorical ? 'categoricalHeader' : 'numericalHeader']

  return (
    <div className={mergeClasses(classes.root, !isOriginal ? styleClass : '')}>
      {column}
    </div>
  )
}
