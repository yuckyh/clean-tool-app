import type { AppState } from '@/app/store'

import { useAppSelector } from '@/lib/hooks'
import { getOriginalColumn } from '@/selectors/columns/selectors'
import {
  makeStyles,
  mergeClasses,
  shorthands,
  tokens,
} from '@fluentui/react-components'

import { getDataType, getFormattedColumn } from '../../columns/selectors'

const useClasses = makeStyles({
  categoricalHeader: {
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground2,
  },
  numericalHeader: {
    backgroundColor: tokens.colorPaletteRedBackground2,
    color: tokens.colorPaletteRedForeground2,
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

/**
 *
 */
interface Props {
  /**
   *
   */
  isOriginal: boolean
  /**
   *
   */
  pos: number
}

/**
 *
 * @param props
 * @param props.isOriginal
 * @param props.pos
 * @returns
 * @example
 */
const selectColumn =
  ({ isOriginal, pos }: Readonly<Props>) =>
  (state: AppState) =>
    isOriginal ? getOriginalColumn(state, pos) : getFormattedColumn(state, pos)

/**
 *
 * @param props
 * @param props.pos
 * @returns
 * @example
 */
const selectDataType =
  ({ pos }: Readonly<Props>) =>
  (state: AppState) =>
    getDataType(state, pos)

/**
 *
 * @param props
 * @example
 */
export default function HeaderCell(props: Readonly<Props>) {
  const classes = useClasses()

  const { isOriginal } = props

  const column = useAppSelector(selectColumn(props))

  const dataType = useAppSelector(selectDataType(props))

  const isCategorical = dataType === 'categorical'

  const styleClass =
    classes[isCategorical ? 'categoricalHeader' : 'numericalHeader']

  return (
    <div className={mergeClasses(classes.root, !isOriginal ? styleClass : '')}>
      {column}
    </div>
  )
}
