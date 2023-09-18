import type { ColumnNameData } from '@/hooks'
import type { CodebookMatch } from '@/workers/column'
import type { ComboboxProps } from '@fluentui/react-components'

import codebook from '@/../data/codebook.json'
import { useAppSelector } from '@/hooks'
import { columnStateStore } from '@/lib/StateStore/column'
import {
  Combobox,
  Option,
  Spinner,
  makeStyles,
} from '@fluentui/react-components'
import Fuse from 'fuse.js'
import { useCallback, useMemo, useState, useTransition } from 'react'

interface MatchCellProps {
  item: ColumnNameData
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const useClasses = makeStyles({
  combobox: {
    minWidth: '200px',
  },
})

const MatchCell = ({ item, setAlertOpen }: MatchCellProps) => {
  const classes = useClasses()
  const { matches, position } = item
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  const { columns } = useAppSelector(({ columns }) => columns)

  const [value, setValue] = useState(columns[position] ?? '')

  const customScore = useMemo(
    () =>
      (
        1 -
        (new Fuse(codebook, {
          includeScore: true,
          keys: ['name'],
          threshold: 1,
        }).search(value)[0]?.score ?? 1)
      ).toFixed(2),
    [value],
  )

  const selectedOption = useMemo(
    () => columns[position] ?? '',
    [position, columns],
  )

  const selectedIndex = useMemo(
    () => matches.findIndex((match) => match.item.name === selectedOption),
    [matches, selectedOption],
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

        const matchIndex = matches.findIndex(
          ({ item }) => item.name === optionValue,
        )

        if (matchIndex < 0) {
          console.log('no match creating new column generating score')
          // create column
        }

        if (matchIndex === selectedIndex) {
          console.log('same column that exists can ignore')
          return
        }

        const checkColumns = [...columns]
        checkColumns[position] = optionValue

        const uSelectedColumns = Array.from(new Set(columns))
        const uCheckColumns = Array.from(new Set(checkColumns))

        if (uSelectedColumns.length !== uCheckColumns.length) {
          setAlertOpen(true)
          return
        }

        startTransition(() => {
          setValue(optionValue)
          setOpen(false)
        })

        columnStateStore.state = checkColumns.join(',')
      },
      [matches, position, columns, selectedIndex, setAlertOpen],
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
      className={classes.combobox}
      onChange={handleComboboxChange}
      onOpenChange={handleOpenChange}
      onOptionSelect={handleOptionSelect}
      open={open}
      selectedOptions={[selectedOption]}
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
