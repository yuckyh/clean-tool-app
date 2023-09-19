import type { ColumnNameData } from '@/lib/hooks'
import type { DropdownProps } from '@fluentui/react-components'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setMatchVisits } from '@/store/columnsSlice'
import { Dropdown, Option, makeStyles } from '@fluentui/react-components'
import { useCallback, useMemo } from 'react'

interface Props {
  item: ColumnNameData
  setAlertOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const useClasses = makeStyles({
  root: {
    minWidth: '150px',
  },
})

const VisitsCell = ({ item: { position }, setAlertOpen }: Props) => {
  const classes = useClasses()
  const dispatch = useAppDispatch()
  const { visits } = useAppSelector(({ sheet }) => sheet)
  const { columns, formattedColumns, matchVisits } = useAppSelector(
    ({ columns }) => columns,
  )

  const selectedOption = useMemo(
    () => (matchVisits[position] ?? 0).toString(),
    [matchVisits, position],
  )

  const handleOptionSelect: Required<DropdownProps>['onOptionSelect'] =
    useCallback(
      (_e, { optionValue }) => {
        if (formattedColumns.includes(columns[position] + '_' + optionValue)) {
          console.log('too many of the same columns')

          setAlertOpen(true)
          return
        }

        const newVisits = [...matchVisits]
        newVisits[position] = parseInt(optionValue ?? '0')

        dispatch(setMatchVisits(newVisits))
      },
      [
        columns,
        dispatch,
        formattedColumns,
        matchVisits,
        position,
        setAlertOpen,
      ],
    )

  return (
    <Dropdown
      appearance="filled-darker"
      className={classes.root}
      onOptionSelect={handleOptionSelect}
      selectedOptions={[selectedOption]}
      value={selectedOption}>
      {Array.from({ length: visits }).map((_, i) => (
        <Option key={i} text={i.toString()}>
          {i}
        </Option>
      ))}
    </Dropdown>
  )
}

export default VisitsCell
