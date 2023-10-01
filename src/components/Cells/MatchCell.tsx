import type { AlertRef } from '@/components/AlertDialog'
import type { ComboboxProps } from '@fluentui/react-components'

import { transpose } from '@/lib/array'
import fuse from '@/lib/fuse'
import { useAppDispatch, useAppSelector, useDebounced } from '@/lib/hooks'
import { just, list } from '@/lib/utils'
import {
  Combobox,
  Option,
  Spinner,
  makeStyles,
} from '@fluentui/react-components'
import { memo, useCallback, useMemo, useState } from 'react'

import type { ColumnNameData } from '../../features/columnsSlice'

import {
  getFormattedColumns,
  setMatchColumns,
  setMatchVisit,
} from '../../features/columnsSlice'

interface Props {
  alertRef: React.RefObject<AlertRef>
  item: ColumnNameData
}

interface FilteredMatch {
  match: string
  pos: number
}

const useClasses = makeStyles({
  root: {
    minWidth: '150px',
  },
})

const MatchCell = ({
  alertRef,
  item: { index, matches, pos, scores },
}: Props) => {
  const classes = useClasses()
  const dispatch = useAppDispatch()
  const { visits } = useAppSelector(({ sheet }) => sheet)
  const matchVisit =
    useAppSelector(({ columns }) => columns.matchVisits)[pos] ?? 0
  const { matchColumns } = useAppSelector(({ columns }) => columns)
  const column = matchColumns[pos] ?? ''
  const formattedColumns = useAppSelector(getFormattedColumns)

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(column)
  const selectedOption = useMemo(() => matches[index] ?? '', [matches, index])
  const deferredValue = useDebounced(value, 750)
  const isDebouncing = value !== deferredValue
  const filteredMatches = matches
    .map((match, i) => ({ match, pos: i }))
    .filter(({ match }) => match.includes(deferredValue))

  const handleOptionSelect: Required<ComboboxProps>['onOptionSelect'] =
    useCallback(
      (_e, { optionValue }) => {
        if (!optionValue) {
          return
        }

        const matchColumn = optionValue

        if (formattedColumns.includes(matchColumn + '_' + matchVisit)) {
          const matchVisit = formattedColumns
            .filter((formatted) => formatted.includes(matchColumn))
            .map((formatted) => parseInt(formatted.split('_').pop() ?? '-1'))
            .sort((a, b) => a - b)
            .findIndex((visit, i) => visit !== i)

          if (matchVisit >= visits) {
            alertRef.current?.openAlert()
            setValue(column)
            return
          }

          just({ matchVisit, pos })(setMatchVisit)(dispatch)()
        }

        just({ matchColumn, pos })(setMatchColumns)(dispatch)()

        setValue(matchColumn)
        setOpen(false)
      },
      [formattedColumns, matchVisit, pos, dispatch, visits, alertRef, column],
    )

  const handleComboboxChange: ComboboxProps['onChange'] = ({ target }) => {
    setValue(target.value)
    setOpen(true)
  }

  const handleOpenChange: ComboboxProps['onOpenChange'] = (_e, { open }) => {
    // startTransition(() => {
    setOpen(open)
    // })
  }

  return (
    <Combobox
      appearance="filled-darker"
      className={classes.root}
      onChange={handleComboboxChange}
      onOpenChange={handleOpenChange}
      onOptionSelect={handleOptionSelect}
      open={open}
      selectedOptions={[selectedOption]}
      value={value}>
      {isDebouncing ? (
        <Option text="loading">
          <Spinner label={'Loading options...'} />
        </Option>
      ) : filteredMatches.length ? (
        <MemoizedFilteredOptions
          filteredMatches={filteredMatches}
          scores={scores}
        />
      ) : (
        <Option text={value} value={value}>
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
  scores: number[]
}

const FilteredOptions = ({ filteredMatches, scores }: FilteredOptionsProps) => (
  <>
    {just([filteredMatches, scores] as const)(transpose).convert(list)(
      ([{ match }, score]) => (
        <FilteredOption key={match} match={match} score={score} />
      ),
    )()}
  </>
)

const MemoizedFilteredOptions = memo(FilteredOptions)

interface FilteredOptionProps {
  match: string
  score: number
}

const FilteredOption = ({ match, score }: FilteredOptionProps) => (
  <Option text={match} value={match}>
    {match}, {(1 - score).toFixed(2)}
  </Option>
)

export default MatchCell
