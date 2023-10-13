import type { ComboboxProps } from '@fluentui/react-components'
import {
  makeStyles,
  Combobox,
  Spinner,
  Option,
} from '@fluentui/react-components'
import { useCallback, useState, useMemo, memo } from 'react'
import { zip } from 'lodash'
import type { AlertRef } from '@/components/AlertDialog'

import { useAppDispatch, useAppSelector, useDebounced } from '@/lib/hooks'
import { indexDuplicateSearcher, range } from '@/lib/array'
import { just } from '@/lib/monads'
import fuse from '@/lib/fuse'

import type { ColumnMatch } from '../reducers'

import {
  getMatchColumn,
  getMatchVisit,
  getMatches,
  getIndices,
  getScores,
} from '../selectors'
import { setMatchColumn, setMatchVisit } from '../reducers'

interface Props {
  alertRef: React.RefObject<AlertRef>
  pos: number
}

const useClasses = makeStyles({
  root: {
    minWidth: '150px',
  },
})

interface FilteredOptionsProps {
  filteredMatches: ColumnMatch[]
  value: string
}

const search = fuse.search.bind(fuse)

function FilteredOptions({ filteredMatches, value }: FilteredOptionsProps) {
  return filteredMatches.length ? (
    filteredMatches.map(({ match, score }) => (
      <Option value={match} text={match} key={match}>
        {match}, {(1 - score).toFixed(2)}
      </Option>
    ))
  ) : (
    <Option value={value} text={value}>
      Create column? {value},{' '}
      {just(value)(search)(([match]) => match?.score ?? 1)(
        (score) => 1 - score,
      )().toFixed(2)}
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
  const indices = useAppSelector(getIndices)

  const [comboboxOpen, setComboboxOpen] = useState(false)
  const [value, setValue] = useState(matchColumn)

  const deferredValue = useDebounced(value, 200)

  const isDebouncing = value !== deferredValue

  const filteredMatches = useMemo(
    () =>
      zip(matches, scores)
        .map(([match = '', score = 0]) => ({
          match,
          score,
        }))
        .filter(({ match }) => match.includes(deferredValue)),
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
          const newMatchVisit = range(visits.length).findIndex(
            (visit) => visit !== matchVisit,
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

          just({ matchVisit: newMatchVisit, pos })(setMatchVisit)(dispatch)
        }

        just({ matchColumn: newMatchColumn, pos })(setMatchColumn)(dispatch)

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
