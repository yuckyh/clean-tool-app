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
  // incorrect: {
  //   backgroundColor: tokens.colorPaletteYellowBackground2,
  // },
  // missing: {
  //   backgroundColor: '#ff7700',
  // },
  // outlier: {
  //   backgroundColor: tokens.colorSubtleBackground,
  // },
  // suspected: {
  //   backgroundColor: tokens.colorPaletteRedBackground3,
  //   color: tokens.colorNeutralStroke3,
  // },
  incorrect: {
    backgroundColor: tokens.colorPaletteYellowBackground2,
    color: tokens.colorPaletteYellowForeground2,
  },
  missing: {
    backgroundColor: tokens.colorStatusWarningBackground2,
    color: tokens.colorStatusWarningForeground2,
  },
  outlier: {
    backgroundColor: tokens.colorNeutralForeground3,
    color: tokens.colorNeutralBackground3,
  },
  root: {
    alignItems: 'center',
    display: 'flex',
    minHeight: '44px',
    width: '100%',
    ...shorthands.padding(0, tokens.spacingHorizontalS),
    justifyContent: 'center',
  },
  suspected: {
    backgroundColor: tokens.colorStatusDangerBackground2,
    color: tokens.colorStatusDangerForeground2,
  },
})

export default function PreviewCell({ col, row }: Props) {
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
