import type { ComboboxProps } from '@fluentui/react-components'
import type { AlertRef } from '@/components/AlertDialog'

import {
  makeStyles,
  Combobox,
  Spinner,
  Option,
} from '@fluentui/react-components'
import { useAppDispatch, useAppSelector, useDebounced } from '@/lib/hooks'
import { useCallback, useState, useMemo, memo } from 'react'
import { transpose, range } from '@/lib/array'
import { just } from '@/lib/utils'
import fuse from '@/lib/fuse'

import { getMatchColumn, getMatchVisit, getIndices } from '../selectors'
import { setMatchColumn, setMatchVisit } from '../reducers'

interface Props {
  alertRef: React.RefObject<AlertRef>
  pos: number
}

interface FilteredMatch {
  match: string
  score: number
  pos: number
}

const useClasses = makeStyles({
  root: {
    minWidth: '150px',
  },
})

const MatchCell = ({ alertRef, pos }: Props) => {
  const classes = useClasses()

  const dispatch = useAppDispatch()

  const visits = useAppSelector(({ sheet }) => sheet.visits)
  const matchColumn = useAppSelector((state) => getMatchColumn(state, pos))
  const matchVisit = useAppSelector((state) => getMatchVisit(state, pos))

  const matches = useAppSelector(
    ({ columns }) => columns.matchLists[pos]?.matches ?? [],
  )
  const indices = useAppSelector(getIndices)

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(matchColumn)

  const deferredValue = useDebounced(value, 200)

  const isDebouncing = value !== deferredValue

  const filteredMatches = useMemo(() => {
    return matches.filter(({ match }) => match.includes(deferredValue))
  }, [deferredValue, matches])

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

        const duplicates = indices.filter((index) =>
          transpose([index, [newMatchColumn, matchVisit]] as const).every(
            ([index, filter]) => index === filter,
          ),
        )

        if (duplicates.length) {
          const newMatchVisit = range(visits.length).findIndex(
            (visit) => visit !== matchVisit,
          )

          if (newMatchVisit === -1) {
            alertRef.current?.open()
            setValue(matchColumn)
            return
          }

          just({ matchVisit: newMatchVisit, pos })(setMatchVisit)(dispatch)()
        }

        just({ matchColumn: newMatchColumn, pos })(setMatchColumn)(dispatch)()

        setValue(newMatchColumn)
        setOpen(false)
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
    setOpen(true)
  }

  const handleOpenChange: ComboboxProps['onOpenChange'] = (_e, { open }) => {
    setOpen(open)
  }

  return (
    <Combobox
      onOptionSelect={handleOptionSelect}
      onChange={handleComboboxChange}
      onOpenChange={handleOpenChange}
      selectedOptions={[matchColumn]}
      appearance="filled-darker"
      className={classes.root}
      value={value}
      open={open}
      freeform>
      {isDebouncing ? (
        <Option text="loading">
          <Spinner label={'Loading options...'} />
        </Option>
      ) : filteredMatches.length ? (
        <MemoizedFilteredOptions filteredMatches={filteredMatches} />
      ) : (
        <Option value={value} text={value}>
          Create column? {value},{' '}
          {just(value)(fuse.search.bind(fuse))(([match]) => match?.score ?? 1)(
            (score) => 1 - score,
          )((score) => score.toFixed(2))()}
        </Option>
      )}
    </Combobox>
  )
}

interface FilteredOptionsProps {
  filteredMatches: FilteredMatch[]
}

const FilteredOptions = ({ filteredMatches }: FilteredOptionsProps) =>
  filteredMatches.map(({ match, score }) => (
    <Option value={match} text={match} key={match}>
      {match}, {(1 - score).toFixed(2)}
    </Option>
  ))

const MemoizedFilteredOptions = memo(FilteredOptions)

export default MatchCell
