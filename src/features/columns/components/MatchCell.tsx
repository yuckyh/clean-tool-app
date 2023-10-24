import type { AlertRef } from '@/components/AlertDialog'
import type { ComboboxProps } from '@fluentui/react-components'
import {
  makeStyles,
  shorthands,
  Combobox,
  Spinner,
  Option,
  tokens,
} from '@fluentui/react-components'
import { useCallback, useState, useMemo, memo } from 'react'

import { indexDuplicateSearcher } from '@/lib/array'
import fuse from '@/lib/fuse'
import { useAppDispatch, useAppSelector, useDebounced } from '@/lib/hooks'

import * as IO from 'fp-ts/IO'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import { constant, identity, apply, flow, pipe } from 'fp-ts/function'
import * as S from 'fp-ts/string'
import * as P from 'fp-ts/Predicate'

import { codebook } from '@/data'
import { numEquals, strEquals } from '@/lib/fp'
import { getRow } from '@/features/sheet/selectors'
import {
  getMatchColumn,
  getMatchVisit,
  getIndices,
  getMatches,
  getScores,
  getVisitByMatchVisit,
} from '../selectors'
import { setMatchColumn, setMatchVisit, setDataType } from '../reducers'
import type { ColumnMatch, DataType } from '../reducers'

interface Props {
  alertRef: React.RefObject<AlertRef>
  pos: number
}

const useClasses = makeStyles({
  root: {
    minWidth: '150px',
    ...shorthands.margin(0, tokens.spacingHorizontalS),
  },
})

interface FilteredOptionsProps {
  filteredMatches: readonly ColumnMatch[]
  value: string
}

const search = fuse.search.bind(fuse)

function FilteredOptions({ filteredMatches, value }: FilteredOptionsProps) {
  return filteredMatches.length ? (
    RA.map<ColumnMatch, JSX.Element>(({ match, score }) => (
      <Option value={match} text={match} key={match}>
        {match}, {(1 - score).toFixed(2)}
      </Option>
    ))(filteredMatches)
  ) : (
    <Option value={value} text={value}>
      Create column? {value},{' '}
      {pipe(
        value,
        search,
        ([match]) => match?.score ?? 1,
        (score) => 1 - score,
        (score) => score.toFixed(2),
      )}
    </Option>
  )
}

const MemoizedFilteredOptions = memo(FilteredOptions)

export default function MatchCell({ alertRef, pos }: Props) {
  const classes = useClasses()

  const dispatch = useAppDispatch()

  const visits = useAppSelector(({ sheet }) => sheet.visits)
  const matchColumn = useAppSelector((state) => getMatchColumn(state, pos))
  const matchVisit = useAppSelector((state) => getMatchVisit(state, pos))
  const matches = useAppSelector((state) => getMatches(state, pos))
  const scores = useAppSelector((state) => getScores(state, pos))
  const visit = useAppSelector((state) => getVisitByMatchVisit(state, pos))
  const row = useAppSelector((state) => getRow(state, matchColumn, visit))
  const indices = useAppSelector(getIndices)

  const [comboboxOpen, setComboboxOpen] = useState(false)
  const [value, setValue] = useState(matchColumn)

  const deferredValue = useDebounced(value, 200)

  const isDebouncing = value !== deferredValue

  const filteredMatches = useMemo(
    () =>
      pipe(
        matches,
        RA.filter(S.includes(deferredValue)),
        RA.zip(scores),
        RA.map(([match, score]) => ({
          match,
          score,
        })),
      ),
    [deferredValue, matches, scores],
  )

  const handleOptionSelect: Required<ComboboxProps>['onOptionSelect'] =
    useCallback(
      (_e, { optionValue }) => {
        if (!optionValue) {
          return
        }

        const newMatchColumn = optionValue

        if (newMatchColumn === matchColumn) {
          return
        }

        const duplicates = indexDuplicateSearcher(indices, [
          newMatchColumn,
          matchVisit,
        ])

        if (duplicates.length) {
          const newMatchVisit = pipe(
            RA.makeBy(visits.length, identity),
            RA.findIndex(P.not(numEquals(matchVisit))),
            pipe(-1, constant, O.getOrElse),
          )

          if (newMatchVisit === -1) {
            alertRef.current?.setContent(
              'You have selected the same column multiple times. Changes will not be made.',
            )
            alertRef.current?.setTitle('Column Matching Error')
            alertRef.current?.open()
            setValue(matchColumn)
            return
          }

          pipe(
            { matchVisit: newMatchVisit, pos },
            setMatchVisit,
            (x) => dispatch(x),
            IO.of,
          )()
        }

        pipe(
          { matchColumn: newMatchColumn, pos },
          setMatchColumn,
          (x) => dispatch(x),
          IO.of,
        )()

        const newDataType: DataType = pipe(
          codebook,
          RA.findFirst(({ name }) => strEquals(name)(matchColumn)),
          O.map(({ type }) =>
            pipe(
              type,
              S.includes,
              RA.some,
              apply(['whole_number', 'interval'] as const),
            ),
          ),
          O.getOrElse(
            () =>
              0.8 * row.length >
              pipe(row, RA.filter(flow(parseFloat, P.not(Number.isNaN))))
                .length,
          ),
          (isCategorical) => (isCategorical ? 'categorical' : 'numerical'),
        )

        pipe(
          { dataType: newDataType, pos },
          setDataType,
          (x) => dispatch(x),
          IO.of,
        )()

        setValue(newMatchColumn)
        setComboboxOpen(false)
      },
      [
        alertRef,
        dispatch,
        indices,
        matchColumn,
        matchVisit,
        pos,
        row,
        visits.length,
      ],
    )

  const handleComboboxChange: ComboboxProps['onChange'] = ({ target }) => {
    setValue(target.value)
    setComboboxOpen(true)
  }

  const handleOpenChange: ComboboxProps['onOpenChange'] = (_e, { open }) => {
    setComboboxOpen(open)
  }

  return (
    <Combobox
      onOptionSelect={handleOptionSelect}
      onChange={handleComboboxChange}
      onOpenChange={handleOpenChange}
      selectedOptions={[matchColumn]}
      appearance="filled-darker"
      className={classes.root}
      open={comboboxOpen}
      value={value}
      freeform>
      {isDebouncing ? (
        <Option text="loading">
          <Spinner label="Loading options..." />
        </Option>
      ) : (
        <MemoizedFilteredOptions
          filteredMatches={filteredMatches}
          value={value}
        />
      )}
    </Combobox>
  )
}
