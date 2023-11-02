import { strEquals } from '@/lib/fp'
import fuse from '@/lib/fuse'
import { add, multiply } from '@/lib/number'
import { Option } from '@fluentui/react-components'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'

const search = fuse.search.bind(fuse)

interface ColumnMatch {
  match: string
  score: number
}

interface Props {
  filteredMatches: readonly ColumnMatch[]
  value: string
}

export default function FilteredOptions({ filteredMatches, value }: Props) {
  const canCreateColumn = !RA.some(strEquals(value))(
    f.pipe(
      filteredMatches,
      RA.map(({ match }) => match),
    ),
  )

  const customScore = f.pipe(
    value,
    search,
    RA.head,
    O.map(
      f.flow(
        ({ score }) => score,
        O.fromNullable,
        f.pipe(1, f.constant, O.getOrElse),
      ),
    ),
    f.pipe(1, f.constant, O.getOrElse),
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
