/**
 * @file This file contains the match cell component for the matches data grid.
 * @module components/matches/MatchCell
 */
import type { AlertRef } from '@/components/AlertDialog'
import type { ComboboxProps } from '@fluentui/react-components'

import { findIndex, getIndexedIndex, indexDuplicateSearcher } from '@/lib/array'
import { useAppDispatch, useAppSelector, useDebounced } from '@/lib/hooks'
import { createMemo } from '@/lib/utils'
import {
  setDataTypeByColumn,
  setMatchColumn,
  setMatchScoreByColumn,
  setMatchVisit,
} from '@/reducers/matches'
import { getVisits } from '@/selectors/data/visits'
import { getIndices } from '@/selectors/matches/format'
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
import {
  selectMatchColumn,
  selectMatchVisit,
  selectResult,
  selectRow,
  selectScoreResult,
} from './selectors'

const MemoizedFilteredOptions = createMemo('FilteredOptions', FilteredOptions)

const useClasses = makeStyles({
  root: {
    minWidth: '150px',
    ...shorthands.margin(0, tokens.spacingHorizontalS),
  },
})

/**
 * The props for {@link MatchCell}.
 */
interface Props {
  /**
   * The alert ref object.
   */
  alertRef: React.RefObject<AlertRef>
  /**
   * The position of the column.
   */
  pos: number
}

/**
 * This function is used to render the match cell in the data grid.
 * @param props - The {@link Props props} for the component.
 * @returns The component object.
 * @example
 * ```tsx
 *  <MatchCell alertRef={alertRef} pos={pos} />
 * ```
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
        RA.zip(scoreResult),
        RA.filter(f.flow(getIndexedIndex, S.includes(deferredValue))),
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
