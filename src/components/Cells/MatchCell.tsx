import type { ComboboxProps } from '@fluentui/react-components'
import {
  Combobox,
  Option,
  Spinner,
  makeStyles,
} from '@fluentui/react-components'
import Fuse from 'fuse.js'
import {
  useSyncExternalStore,
  useMemo,
  useState,
  useCallback,
  useTransition,
} from 'react'

import type { CodebookMatch, ColumnNameData } from '@/hooks'
import { columnStateStore } from '@/lib/StateStore/column'
import codebook from '@/../data/codebook.json'

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

  const selectedColumns = Array.from(
    useSyncExternalStore(
      columnStateStore.subscribe,
      () => columnStateStore.columns,
    ),
  )

  const [value, setValue] = useState(selectedColumns[position] ?? '')

  const customScore = useMemo(
    () =>
      (
        1 -
        (new Fuse(codebook, {
          threshold: 1,
          includeScore: true,
          keys: ['name'],
        }).search(value)[0]?.score ?? 1)
      ).toFixed(2),
    [value],
  )

  const selectedOption = useMemo(
    () => selectedColumns[position] ?? '',
    [position, selectedColumns],
  )

  const selectedIndex = useMemo(
    () => matches.findIndex((match) => match.item.name === selectedOption),
    [matches, selectedOption],
  )

  const filteredMatches = useMemo(
    () => matches.filter(({ item }) => item.name?.includes(value)),
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

        const checkColumns = [...selectedColumns]
        checkColumns[position] = optionValue

        const uSelectedColumns = Array.from(new Set(selectedColumns))
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
      [matches, position, selectedColumns, selectedIndex, setAlertOpen],
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
      className={classes.combobox}
      value={value}
      selectedOptions={[selectedOption]}
      onChange={handleComboboxChange}
      onOptionSelect={handleOptionSelect}
      open={open}
      onOpenChange={handleOpenChange}
      appearance="filled-darker">
      {isPending ? (
        <Option text="loading">
          <Spinner label={'Loading options...'} />
        </Option>
      ) : filteredMatches.length ? (
        filteredMatches.map(({ item, score }) => (
          <MatchOption key={item.name} item={item} score={score ?? 1} />
        ))
      ) : (
        <Option value={value} text={value}>
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
  <Option value={item.name} text={item.name ?? ''}>
    {item.name}, {(1 - score).toFixed(2)}
  </Option>
)

export default MatchCell
