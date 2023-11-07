import type { AlertRef } from '@/components/AlertDialog'
import type { ComboboxProps } from '@fluentui/react-components'

import { codebook } from '@/data'
import { getRow } from '@/features/sheet/selectors'
import { indexDuplicateSearcher } from '@/lib/array'
import { equals, isCorrectNumber } from '@/lib/fp'
import { useAppDispatch, useAppSelector, useDebounced } from '@/lib/hooks'
import { createMemo } from '@/lib/utils'
import { getMatchColumn } from '@/selectors/columns/selectors'
import {
  Combobox,
  Option,
  Spinner,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import * as IO from 'fp-ts/IO'
import * as O from 'fp-ts/Option'
import * as P from 'fp-ts/Predicate'
import * as RA from 'fp-ts/ReadonlyArray'
import * as B from 'fp-ts/boolean'
import * as f from 'fp-ts/function'
import * as N from 'fp-ts/number'
import * as S from 'fp-ts/string'
import { useCallback, useMemo, useState } from 'react'

import type { DataType } from '../reducers'

import { setDataType, setMatchColumn, setMatchVisit } from '../reducers'
import {
  getIndices,
  getMatchVisit,
  getMatches,
  getScores,
  getVisitByMatchVisit,
} from '../selectors'
import FilteredOptions from './FilteredOptions'

const MemoizedFilteredOptions = createMemo('FilteredOptions', FilteredOptions)

const useClasses = makeStyles({
  root: {
    minWidth: '150px',
    ...shorthands.margin(0, tokens.spacingHorizontalS),
  },
})

/**
 *
 */
interface Props {
  alertRef: React.RefObject<AlertRef>
  pos: number
}

/**
 *
 * @param props
 * @param props.alertRef
 * @param props.pos
 * @example
 */
export default function MatchCell({ alertRef, pos }: Readonly<Props>) {
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
      f.pipe(
        matches,
        f.pipe(deferredValue, S.includes, RA.filter<string>),
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
          const newMatchVisit = f.pipe(
            RA.makeBy(visits.length, f.identity),
            RA.findIndex(P.not(equals(N.Eq)(matchVisit))),
            f.pipe(-1, f.constant, O.getOrElse),
          )

          if (newMatchVisit === -1) {
            alertRef.current?.open()
            setValue(matchColumn)
            return
          }

          f.pipe(
            { matchVisit: newMatchVisit, pos },
            setMatchVisit,
            (x) => dispatch(x),
            IO.of,
          )()
        }

        f.pipe(
          { matchColumn: newMatchColumn, pos },
          setMatchColumn,
          (x) => dispatch(x),
          IO.of,
        )()

        const newDataType: DataType = f.pipe(
          codebook,
          RA.findFirst(({ name }) => equals(S.Eq)(name)(newMatchColumn)),
          O.map(({ type }) =>
            f.pipe(
              type,
              S.includes,
              RA.some,
              f.apply(['whole_number', 'interval'] as const),
            ),
          ),
          O.getOrElse(
            () =>
              0.6 * row.length < f.pipe(row, RA.filter(isCorrectNumber)).length,
          ),
          B.match(f.constant('categorical'), f.constant('numerical')),
        )

        f.pipe(
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
      appearance="filled-darker"
      className={classes.root}
      freeform
      onChange={handleComboboxChange}
      onOpenChange={handleOpenChange}
      onOptionSelect={handleOptionSelect}
      open={comboboxOpen}
      selectedOptions={[matchColumn]}
      value={value}>
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
