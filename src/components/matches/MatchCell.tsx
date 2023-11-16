import type { AppState } from '@/app/store'
import type { AlertRef } from '@/components/AlertDialog'
import type { ComboboxProps } from '@fluentui/react-components'

import { findIndex, indexDuplicateSearcher } from '@/lib/array'
import { useAppDispatch, useAppSelector, useDebounced } from '@/lib/hooks'
import { createMemo } from '@/lib/utils'
import {
  setDataTypeByColumn,
  setMatchColumn,
  setMatchScoreByColumn,
  setMatchVisit,
} from '@/reducers/matches'
import { getRow } from '@/selectors/data/rows'
import { getVisits } from '@/selectors/data/visits'
import { getMatchColumn } from '@/selectors/matches/columns'
import { getIndices } from '@/selectors/matches/format'
import { getMatchResult, getScoreResult } from '@/selectors/matches/results'
import { getMatchVisit, getVisitByMatchVisit } from '@/selectors/matches/visits'
import {
  Combobox,
  Option,
  Spinner,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import * as IO from 'fp-ts/IO'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'
import * as N from 'fp-ts/number'
import * as S from 'fp-ts/string'
import { useCallback, useMemo, useState } from 'react'

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
  /**
   *
   */
  alertRef: React.RefObject<AlertRef>
  /**
   *
   */
  pos: number
}

/**
 *
 * @param props
 * @param props.pos
 * @returns
 * @example
 */
const selectMatchColumn =
  ({ pos }: Readonly<Props>) =>
  (state: AppState) =>
    getMatchColumn(state, pos)

/**
 *
 * @param props
 * @param props.pos
 * @returns
 * @example
 */
const selectMatchVisit =
  ({ pos }: Readonly<Props>) =>
  (state: AppState) =>
    getMatchVisit(state, pos)

/**
 *
 * @param props
 * @param props.pos
 * @returns
 * @example
 */
const selectResult =
  ({ pos }: Readonly<Props>) =>
  (state: AppState) =>
    getMatchResult(state, pos)

/**
 *
 * @param props
 * @param props.pos
 * @returns
 * @example
 */
const selectScoreResult =
  ({ pos }: Readonly<Props>) =>
  (state: AppState) =>
    getScoreResult(state, pos)

/**
 *
 * @param props
 * @param props.pos
 * @returns
 * @example
 */
const selectVisitByMatchVisit =
  ({ pos }: Readonly<Props>) =>
  (state: AppState) =>
    getVisitByMatchVisit(state, pos)

/**
 *
 * @param props
 * @returns
 * @example
 */
const selectRow = (props: Readonly<Props>) => (state: AppState) =>
  getRow(
    state,
    selectMatchColumn(props)(state),
    selectVisitByMatchVisit(props)(state),
  )

/**
 *
 * @param props
 * @param props.alertRef
 * @param props.pos
 * @example
 */
export default function MatchCell(props: Readonly<Props>) {
  const classes = useClasses()

  const { alertRef, pos } = props

  const dispatch = useAppDispatch()

  const visits = useAppSelector(getVisits)
  const matchColumn = useAppSelector(selectMatchColumn(props))
  const matchVisit = useAppSelector(selectMatchVisit(props))
  const result = useAppSelector(selectResult(props))
  const scoreResult = useAppSelector(selectScoreResult(props))
  const row = useAppSelector(selectRow(props))
  const indices = useAppSelector(getIndices)

  const [comboboxOpen, setComboboxOpen] = useState(false)
  const [value, setValue] = useState(matchColumn)

  const deferredValue = useDebounced(value, 200)

  const isDebouncing = value !== deferredValue

  const filteredMatches = useMemo(
    () =>
      f.pipe(
        result,
        f.pipe(deferredValue, S.includes, RA.filter<string>),
        RA.zip(scoreResult),
        RA.map(([match, score]) => ({
          match,
          score,
        })),
      ),
    [deferredValue, result, scoreResult],
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
            findIndex,
          )(N.Eq)(matchVisit)

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
          [setMatchColumn, setMatchScoreByColumn] as const,
          IO.traverseArray(
            f.flow(
              (x) => dispatch(x({ matchColumn: newMatchColumn, pos })),
              IO.of,
            ),
          ),
        )()

        f.pipe(
          setDataTypeByColumn,
          (x) => dispatch(x({ matchColumn: newMatchColumn, pos, row })),
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
