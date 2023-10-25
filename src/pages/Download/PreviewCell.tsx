import { getFormattedColumn } from '@/features/columns/selectors'
import { getColumn, getIndexRow } from '@/features/sheet/selectors'
import { stringLookup } from '@/lib/array'
import { strEquals } from '@/lib/fp'
import { useAppSelector } from '@/lib/hooks'
import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RR from 'fp-ts/ReadonlyRecord'
import { constant, flow, identity, pipe } from 'fp-ts/function'

interface Props {
  col: number
  row: number
}

const useClasses = makeStyles({
  cell: {
    alignItems: 'center',
    display: 'flex',
    minHeight: '44px',
    width: '100%',
  },
  incorrect: {
    backgroundColor: tokens.colorPalettePinkBackground2,
  },
  missing: {
    backgroundColor: tokens.colorPaletteYellowBackground2,
  },
  outlier: {
    backgroundColor: tokens.colorPaletteRedBackground2,
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
  const styleClass = pipe(
    flaggedCells,
    RA.filter(
      ([flagIndex, flagColumn]) =>
        strEquals(index)(flagIndex) && strEquals(formattedColumn)(flagColumn),
    ),
    E.fromPredicate((flags) => flags.length === 1, identity),
    E.map(
      flow(
        RA.head,
        O.flatMap(([, , reason]) => RR.lookup(reason)(classes)),
        pipe('', constant, O.getOrElse),
      ),
    ),
    E.getOrElse(
      flow(
        O.fromPredicate((flags) => flags.length > 1),
        O.flatMap(
          flow(
            RA.filter(([, , reason]) => reason !== 'outlier'),
            RA.head,
            O.flatMap(([, , reason]) => RR.lookup(reason)(classes)),
          ),
        ),
        pipe('', constant, O.getOrElse),
      ),
    ),
  )

  return <div className={mergeClasses(classes.cell, styleClass)}>{cell}</div>
}
