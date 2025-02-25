/**
 * @file This file contains the filtered options component for the column matching page.
 * @module pages/ColumnMatching/FilteredOptions
 */

import { equals } from '@/lib/fp'
import { add, multiply } from '@/lib/fp/number'
import { search } from '@/lib/fuse'
import { Option } from '@fluentui/react-components'
import * as O from 'fp-ts/Option'
import * as P from 'fp-ts/Predicate'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'
import * as S from 'fp-ts/string'

/**
 *
 */
interface ColumnMatch {
  /**
   *
   */
  match: string
  /**
   *
   */
  score: number
}

/**
 * The props for {@link FilteredOptions}.
 */
interface Props {
  /**
   *
   */
  filteredMatches: readonly ColumnMatch[]
  /**
   *
   */
  value: string
}

/**
 * The filtered options component for the column matching page.
 * @param props - The {@link Props props} for the component.
 * @param props.filteredMatches - The matches that has been filtered by a combo box.
 * @param props.value - The value of the column.
 * @returns A component object.
 * @example
 * ```tsx
 *  <FilteredOptions filteredMatches={filteredMatches} value={value} />
 * ```
 */
export default function FilteredOptions({
  filteredMatches,
  value,
}: Readonly<Props>) {
  const canCreateColumn = f.pipe(
    filteredMatches,
    RA.map(({ match }) => match),
    f.pipe(equals(S.Eq)(value), P.not, RA.every<string>),
  )

  const customScore = f.pipe(
    value,
    search,
    RA.head,
    O.map(
      f.flow(
        ({ score }) => score,
        O.fromNullable,
        O.getOrElse(() => 1),
      ),
    ),
    O.getOrElse(() => 1),
    multiply(-1),
    add(1),
    (score) => score.toFixed(2),
  )

  return (
    <>
      {canCreateColumn && (
        <Option text={value} value={value}>
          Create column? {value}, {customScore}
        </Option>
      )}
      {!!filteredMatches.length &&
        f.pipe(
          filteredMatches,
          RA.map(({ match, score }) => (
            <Option key={match} text={match} value={match}>
              {match}, {(1 - score).toFixed(2)}
            </Option>
          )),
        )}
    </>
  )
}
