import { mergeClasses, makeStyles, tokens } from '@fluentui/react-components'
import { useAppSelector } from '@/lib/hooks'

import { codebook } from '@/data'
import * as RA from 'fp-ts/ReadonlyArray'
import * as S from 'fp-ts/string'
import { pipe } from 'fp-ts/function'
import { getColumn } from '../selectors'
import { getFormattedColumn } from '../../columns/selectors'

interface Props {
  isOriginal: boolean
  pos: number
}

const useClasses = makeStyles({
  columnHeader: {
    alignItems: 'center',
    fontWeight: 'bold',
    minHeight: '40px',
    display: 'flex',
    width: '100%',
  },
  categoricalHeader: {
    backgroundColor: tokens.colorPalettePurpleBackground2,
  },
  numericalHeader: {
    backgroundColor: tokens.colorPaletteBerryBackground2,
  },
})

export default function PreviewHeaderCell({ isOriginal, pos }: Props) {
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
    <div className={mergeClasses(classes.columnHeader, styleClass)}>
      {column}
    </div>
  )
}
