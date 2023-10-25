import { codebook } from '@/data'
import { useAppSelector } from '@/lib/hooks'
import {
  makeStyles,
  mergeClasses,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import * as S from 'fp-ts/string'

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
  root: {
    alignItems: 'center',
    display: 'flex',
    fontWeight: 'bold',
    minHeight: '44px',
    textAlign: 'center',
    width: '100%',
    ...shorthands.padding(0, tokens.spacingHorizontalS),
  },
})

export default function HeaderCell({ isOriginal, pos }: Props) {
  const classes = useClasses()

  const column = useAppSelector((state) =>
    isOriginal ? getColumn(state, pos) : getFormattedColumn(state, pos),
  )

  const { type = '' } = codebook.find(({ name }) => column === name) ?? {}

  const measurementType = pipe(
    ['whole_number', 'interval'] as const,
    pipe(type, S.includes, RA.some),
  )
    ? 'numerical'
    : 'categorical'

  const isCodebookCategorical = measurementType === 'categorical'

  const styleClass =
    classes[isCodebookCategorical ? 'categoricalHeader' : 'numericalHeader']

  return (
    <div className={mergeClasses(classes.root, !isOriginal ? styleClass : '')}>
      {column}
    </div>
  )
}
