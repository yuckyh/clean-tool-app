import type { Flag, FlagReason } from '@/features/sheet/reducers'

import { getFlaggedCells } from '@/app/selectors'
import { getFormattedColumn } from '@/features/columns/selectors'
import { getCell, getIndexRow } from '@/features/sheet/selectors'
import { stringLookup } from '@/lib/array'
import { equals, stubEq, typedEq } from '@/lib/fp'
import { useAppSelector } from '@/lib/hooks'
import {
  makeStyles,
  mergeClasses,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import * as E from 'fp-ts/Either'
import * as Eq from 'fp-ts/Eq'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as f from 'fp-ts/function'
import * as S from 'fp-ts/string'
import { useMemo } from 'react'

const useClasses = makeStyles({
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

/**
 * The props for {@link PreviewCell}
 */
export interface Props {
  /**
   * The column index
   */
  col: number
  /**
   * The row index
   */
  row: number
}

const reasonInFlagEq = Eq.tuple(
  stubEq<string>(),
  stubEq<string>(),
  typedEq<FlagReason, string>(S.Eq),
)

/**
 * The cell in the {@link PreviewDataGrid} that displays the value of the data value with the flag formatting
 * @param props - The component's props
 * @param props.col - The column index
 * @param props.row - The row index
 * @returns JSX.Element
 */
export default function PreviewCell({ col, row }: Readonly<Props>) {
  const classes = useClasses()

  const cell = useAppSelector((state) => getCell(state, col, row))
  const flaggedCells = useAppSelector(getFlaggedCells)
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
          equals(Eq.tuple(S.Eq, S.Eq, stubEq()))([index, formattedColumn, '']),
        ),
        E.fromPredicate((flags) => flags.length === 1, f.identity),
        E.getOrElse(
          f.flow(
            O.fromPredicate((flags) => flags.length > 1),
            O.map(
              RA.filter(
                f.pipe(['', '', 'outlier'] as Flag, equals(reasonInFlagEq)),
              ),
            ),
            O.getOrElse(f.constant(RA.empty as readonly Flag[])),
          ),
        ),
        RA.head,
        O.getOrElse(f.constant(['', '', 'outlier'] as Flag)),
        (flag) => RR.lookup(flag[2])(classes),
        f.pipe('', f.constant, O.getOrElse),
      ),
    [classes, flaggedCells, formattedColumn, index],
  )

  return <div className={mergeClasses(classes.root, styleClass)}>{cell}</div>
}
