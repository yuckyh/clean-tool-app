/**
 * @file This file contains the header cell component for the preview data grid
 * @module components/data/HeaderCell
 */

import { useAppSelector } from '@/lib/hooks'
import {
  makeStyles,
  mergeClasses,
  shorthands,
  tokens,
} from '@fluentui/react-components'

import { selectColumn, selectDataType } from './selectors'

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
 * The props for {@link HeaderCell}.
 */
export interface Props {
  /**
   * Whether the column is the original column or the formatted column.
   */
  isOriginal: boolean
  /**
   * The position of the column.
   */
  pos: number
}

/**
 * This function renders the header cell for the preview data grid.
 * @param props - The {@link Props props} for the component.
 * @returns The component object.
 * @example
 * ```tsx
 *  <HeaderCell isOriginal={isOriginal} pos={pos} />
 * ```
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
