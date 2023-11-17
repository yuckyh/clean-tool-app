import type { AppState } from '@/app/store'

import { arrayLookup, head, recordLookup } from '@/lib/array'
import { equals } from '@/lib/fp'
import { refinedEq, stubEq } from '@/lib/fp/Eq'
import * as Flag from '@/lib/fp/Flag'
import { lt } from '@/lib/fp/number'
import { useAppSelector } from '@/lib/hooks'
import { getCell, getFlaggedCells } from '@/selectors/data/cells'
import { getIndexRow } from '@/selectors/data/rows'
import { getFormattedColumn } from '@/selectors/matches/format'
import {
  makeStyles,
  mergeClasses,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import * as E from 'fp-ts/Either'
import * as Eq from 'fp-ts/Eq'
import * as O from 'fp-ts/Option'
import * as P from 'fp-ts/Predicate'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'
import * as N from 'fp-ts/number'
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
  none: {
    alignItems: 'center',
    display: 'flex',
    minHeight: '44px',
    width: '100%',
    ...shorthands.padding(0, tokens.spacingHorizontalS),
    justifyContent: 'center',
  },
  outlier: {
    backgroundColor: tokens.colorNeutralForeground3,
    color: tokens.colorNeutralBackground3,
  },
  suspected: {
    backgroundColor: tokens.colorStatusDangerBackground2,
    color: tokens.colorStatusDangerForeground2,
  },
})

const reasonInFlagEq = Eq.tuple(
  stubEq<string>(),
  stubEq<string>(),
  refinedEq<Flag.FlagReason, string>(S.Eq),
)

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

/**
 *
 * @param props
 * @param props.col
 * @param props.row
 * @returns
 * @example
 */
const selectCell =
  ({ col, row }: Readonly<Props>) =>
  (state: AppState) =>
    getCell(state, col, row)

/**
 *
 * @param props
 * @param props.col
 * @returns
 * @example
 */
const selectFormattedColumn =
  ({ col }: Readonly<Props>) =>
  (state: AppState) =>
    getFormattedColumn(state, col)

/**
 *
 * @param props
 * @param props.row
 * @returns
 * @example
 */
const selectIndex =
  ({ row }: Readonly<Props>) =>
  (state: AppState) =>
    arrayLookup(getIndexRow(state))('')(row)

/**
 * The cell in the {@link components/SimpleDataGrid SimpleDataGrid} that displays the value of the data value with the flag formatting
 * @param props - The component's props
 * @returns JSX.Element
 * @example
 * ```tsx
 *  <PreviewCell col={col} row={row} />
 * ```
 */
export default function PreviewCell(props: Readonly<Props>) {
  const classes = useClasses()

  const cell = useAppSelector(selectCell(props))
  const flaggedCells = useAppSelector(getFlaggedCells)
  const formattedColumn = useAppSelector(selectFormattedColumn(props))
  const index = useAppSelector(selectIndex(props))

  const styleClass = useMemo(
    () =>
      f.pipe(
        Eq.tuple(S.Eq, S.Eq, stubEq()),
        Flag.getEq,
        equals<Flag.Flag>,
        f.apply(Flag.of(index, formattedColumn, 'none')),
        RA.filter<Flag.Flag>,
        f.apply(flaggedCells),
        E.fromPredicate(f.flow(RA.size, equals(N.Eq)(1)), f.identity),
        E.getOrElse(
          f.flow(
            O.fromPredicate(f.flow(RA.size, lt(1))),
            O.match(
              () => [] as readonly Flag.Flag[],
              f.pipe(
                reasonInFlagEq,
                Flag.getEq,
                equals,
                f.apply(Flag.of('', '', 'outlier')),
                P.not,
                RA.filter<Flag.Flag>,
              ),
            ),
          ),
        ),
        head,
        f.apply(Flag.of('', '', 'none')),
        Flag.unwrap,
        ([, , reason]) => reason,
        recordLookup(classes)(''),
      ),
    [classes, flaggedCells, formattedColumn, index],
  )

  return <div className={mergeClasses(classes.none, styleClass)}>{cell}</div>
}
