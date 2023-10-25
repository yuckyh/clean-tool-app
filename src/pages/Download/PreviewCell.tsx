import { getFormattedColumn } from '@/features/columns/selectors'
import { getColumn, getIndexRow } from '@/features/sheet/selectors'
import { stringLookup } from '@/lib/array'
import { strEquals } from '@/lib/fp'
import { useAppSelector } from '@/lib/hooks'
import {
  makeStyles,
  mergeClasses,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as f from 'fp-ts/function'
import { useMemo } from 'react'

interface Props {
  col: number
  row: number
}

const useClasses = makeStyles({
  incorrect: {
    backgroundColor: tokens.colorPaletteBerryBackground3,
  },
  missing: {
    backgroundColor: tokens.colorPaletteYellowBackground3,
  },
  outlier: {
    backgroundColor: tokens.colorPaletteRedBackground3,
  },
  root: {
    alignItems: 'center',
    display: 'flex',
    minHeight: '44px',
    width: '100%',
    ...shorthands.padding(0, tokens.spacingHorizontalS),
    justifyContent: 'center',
  },
})

export default function DownloadPreviewCell({ col, row }: Props) {
  const classes = useClasses()

  const column = useAppSelector((state) => getColumn(state, col))
  const cell = useAppSelector(({ sheet }) => sheet.data[row]?.[column])
  const flaggedCells = useAppSelector(({ sheet }) => sheet.flaggedCells)
  const formattedColumn = useAppSelector((state) =>
    getFormattedColumn(state, col),
  )
  const indexRow = useAppSelector(getIndexRow)
  const index = stringLookup(indexRow)(row)
  const styleClass = useMemo(
    () =>
      f.pipe(
        flaggedCells,
        RA.filter(
          ([flagIndex, flagColumn]) =>
            strEquals(index)(flagIndex) &&
            strEquals(formattedColumn)(flagColumn),
        ),
        E.fromPredicate((flags) => flags.length === 1, f.identity),
        E.map(
          f.flow(
            RA.head,
            O.flatMap(([, , reason]) => RR.lookup(reason)(classes)),
            f.pipe('', f.constant, O.getOrElse),
          ),
        ),
        E.getOrElse(
          f.flow(
            O.fromPredicate((flags) => flags.length > 1),
            O.flatMap(
              f.flow(
                RA.filter(([, , reason]) => reason !== 'outlier'),
                RA.head,
                O.flatMap(([, , reason]) => RR.lookup(reason)(classes)),
              ),
            ),
            f.pipe('', f.constant, O.getOrElse),
          ),
        ),
      ),
    [classes, flaggedCells, formattedColumn, index],
  )

  return <div className={mergeClasses(classes.root, styleClass)}>{cell}</div>
}
