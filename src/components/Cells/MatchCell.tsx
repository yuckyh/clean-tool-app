import type { AlertRef } from '@/components/AlertDialog'
import type { ComboboxProps } from '@fluentui/react-components'

import { codebook } from '@/data'
import fuse from '@/lib/fuse'
import { useAppDispatch, useAppSelector, useDebounced } from '@/lib/hooks'
import { just } from '@/lib/utils'
import {
  Combobox,
  Option,
  Spinner,
  makeStyles,
} from '@fluentui/react-components'
import { memo, useCallback, useMemo, useState } from 'react'

import type { ColumnNameData } from '../../features/columnsSlice'

import {
  getColumns,
  getFormattedColumns,
  setMatchRef,
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
  item: { index, matches, pos, refIndices, scores },
}: Props) => {
  const classes = useClasses()
  const dispatch = useAppDispatch()
  const { visits } = useAppSelector(({ sheet }) => sheet)
  const matchVisit =
    useAppSelector(({ columns }) => columns.matchVisits)[pos] ?? 0
  const column = useAppSelector(getColumns)[pos] ?? ''
  const formattedColumns = useAppSelector(getFormattedColumns)

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(column)
  const selectedOption = useMemo(
    () => refIndices[index]?.toString() ?? '',
    [refIndices, index],
  )
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

        const matchRef = parseInt(optionValue)

        const selectedColumn = codebook[matchRef]?.name ?? ''

        if (formattedColumns.includes(selectedColumn + '_' + matchVisit)) {
          const usableMatchVisit = formattedColumns
            .filter((formatted) => formatted.includes(selectedColumn))
            .map((formatted) => parseInt(formatted.split('_').pop() ?? '-1'))
            .sort((a, b) => a - b)
            .findIndex((visit, i) => visit !== i)

          if (matchVisit >= visits) {
            console.log(
              formattedColumns.filter((value) =>
                value.includes(selectedColumn),
              ),
            )

            alertRef.current?.openAlert()
            setValue(column)
            return
          }

          just({ matchVisit: usableMatchVisit, pos })(setMatchVisit)(dispatch)
        }

        just({ matchRef, pos })(setMatchRef)(dispatch)

        setValue(selectedColumn)
        setOpen(false)
      },
      [formattedColumns, matchVisit, dispatch, pos, visits, alertRef, column],
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
          refIndices={refIndices}
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
  refIndices: number[]
  scores: number[]
}

const FilteredOptions = ({
  filteredMatches,
  refIndices,
  scores,
}: FilteredOptionsProps) => (
  <>
    {filteredMatches.map(({ match, pos }) => (
      <FilteredOption
        key={refIndices[pos] ?? -1}
        match={match}
        refIndex={refIndices[pos] ?? -1}
        score={scores[pos] ?? 1}
      />
    ))}
  </>
)

const MemoizedFilteredOptions = memo(FilteredOptions)

interface FilteredOptionProps {
  match: string
  refIndex: number
  score: number
}

const FilteredOption = ({ match, refIndex, score }: FilteredOptionProps) => (
  <Option text={match} value={refIndex.toString()}>
    {match}, {(1 - score).toFixed(2)}
  </Option>
)

export default MatchCell
