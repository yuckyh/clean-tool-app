import { getFlaggedCells } from '@/app/selectors'
import { getFormattedColumn } from '@/features/columns/selectors'
import { getCell, getIndexRow } from '@/features/sheet/selectors'
import { arrayLookup } from '@/lib/array'
import { equals, refinedEq, stubEq } from '@/lib/fp'
import * as Flag from '@/lib/fp/Flag'
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

// import Download from './index'

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
 * The props for {@link pages/Download Download}.
 */
interface Props {
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
  refinedEq<Flag.FlagReason, string>(S.Eq),
)

/**
 * The cell in the {@link components/SimpleDataGrid SimpleDataGrid} that displays the value of the data value with the flag formatting
 * @param props - The component's props
 * @param props.col - The column index
 * @param props.row - The row index
 * @returns JSX.Element
 * @example
 */
export default function PreviewCell({ col, row }: Readonly<Props>) {
  const classes = useClasses()

  const cell = useAppSelector((state) => getCell(state, col, row))
  const flaggedCells = useAppSelector(getFlaggedCells)
  const formattedColumn = useAppSelector((state) =>
    getFormattedColumn(state, col),
  )
  const indexRow = useAppSelector(getIndexRow)
  const index = arrayLookup(indexRow)('')(row)

  const styleClass = useMemo(
    () =>
      f.pipe(
        flaggedCells,
        RA.filter(
          f.pipe(
            Eq.tuple(S.Eq, S.Eq, stubEq()),
            Flag.getEq,
            equals,
            f.apply(Flag.of(index, formattedColumn, 'none')),
          ),
        ),
        E.fromPredicate((flags) => flags.length === 1, f.identity),
        E.getOrElse(
          f.flow(
            O.fromPredicate((flags) => flags.length > 1),
            O.map(
              RA.filter(
                f.pipe(
                  Flag.of('', '', 'outlier'),
                  equals(Flag.getEq(reasonInFlagEq)),
                ),
              ),
            ),
            O.getOrElse(f.constant(RA.empty as readonly Flag.Flag[])),
          ),
        ),
        RA.head,
        O.getOrElse(() => Flag.of('', '', 'outlier')),
        ({ value }) => RR.lookup(value[2])(classes),
        f.pipe('', f.constant, O.getOrElse),
      ),
    [classes, flaggedCells, formattedColumn, index],
  )

  return <div className={mergeClasses(classes.root, styleClass)}>{cell}</div>
}
