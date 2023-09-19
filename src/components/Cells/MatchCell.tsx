import type { ColumnNameData } from '@/lib/hooks'
import type { CodebookMatch } from '@/workers/column'
import type { ComboboxProps } from '@fluentui/react-components'

import fuse from '@/lib/fuse'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setColumns, setMatchRefs, setMatchVisits } from '@/store/columnsSlice'
import {
  Combobox,
  Option,
  Spinner,
  makeStyles,
} from '@fluentui/react-components'
import { useCallback, useMemo, useState, useTransition } from 'react'

interface Props {
  item: ColumnNameData
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const useClasses = makeStyles({
  root: {
    minWidth: '150px',
  },
})

const MatchCell = ({ item: { matches, position }, setAlertOpen }: Props) => {
  const classes = useClasses()
  const { visits } = useAppSelector(({ sheet }) => sheet)
  const { columns, formattedColumns, matchRefs, matchVisits } = useAppSelector(
    ({ columns }) => columns,
  )
  const dispatch = useAppDispatch()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  const [value, setValue] = useState(columns[position] ?? '')

  const customScore = useMemo(
    () => (1 - (fuse.search(value)[0]?.score ?? 1)).toFixed(2),
    [value],
  )

  const filteredMatches = useMemo(
    () => matches.filter(({ item }) => item.name.includes(value)),
    [matches, value],
  )

  const handleOptionSelect: Required<ComboboxProps>['onOptionSelect'] =
    useCallback(
      (_e, { optionValue }) => {
        if (!optionValue) {
          return
        }

        const matchIndex =
          matches.find(({ item }) => item.name === optionValue)?.refIndex ?? -1

        if (
          formattedColumns.includes(optionValue + '_' + matchVisits[position])
        ) {
          console.log('duplicate visit incrementing visit count')
          if ((matchVisits[position] ?? 0) >= visits) {
            console.log('too many of the same columns')

            setAlertOpen(true)
            setValue(columns[position] ?? '')
            return
          }
          const newVisits = [...matchVisits]
          newVisits[position] += 1

          dispatch(setMatchVisits(newVisits))
        }
        const newColumns = [...columns]
        newColumns[position] = optionValue

        const newRefs = [...matchRefs]
        newRefs[position] = matchIndex

        startTransition(() => {
          setValue(optionValue)
          setOpen(false)
        })

        dispatch(setColumns(newColumns))
        dispatch(setMatchRefs(newRefs))
      },
      [
        matches,
        formattedColumns,
        matchVisits,
        position,
        columns,
        matchRefs,
        dispatch,
        visits,
        setAlertOpen,
      ],
    )

  const handleComboboxChange: Required<ComboboxProps>['onChange'] = useCallback(
    ({ target }) => {
      setOpen(true)
      startTransition(() => {
        setValue(target.value)
      })
    },
    [],
  )

  const handleOpenChange: Required<ComboboxProps>['onOpenChange'] = useCallback(
    (_e, { open }) => {
      setOpen(open)
    },
    [],
  )

  return (
    <Combobox
      appearance="filled-darker"
      className={classes.root}
      onChange={handleComboboxChange}
      onOpenChange={handleOpenChange}
      onOptionSelect={handleOptionSelect}
      open={open}
      selectedOptions={[columns[position] ?? '']}
      value={value}>
      {isPending ? (
        <Option text="loading">
          <Spinner label={'Loading options...'} />
        </Option>
      ) : filteredMatches.length ? (
        filteredMatches.map(({ item, score }) => (
          <MatchOption item={item} key={item.name} score={score ?? 1} />
        ))
      ) : (
        <Option text={value} value={value}>
          Create column? {value}, {customScore}
        </Option>
      )}
    </Combobox>
  )
}

interface MatchOptionProps {
  item: CodebookMatch
  score: number
}

const MatchOption = ({ item, score }: MatchOptionProps) => (
  <Option text={item.name ?? ''} value={item.name}>
    {item.name}, {(1 - score).toFixed(2)}
  </Option>
)

export default MatchCell
