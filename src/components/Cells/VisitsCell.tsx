import type { AlertRef } from '@/components/AlertDialog'
import type { DropdownProps } from '@fluentui/react-components'
import type { RefObject } from 'react'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { just, list } from '@/lib/utils'
import { Dropdown, Option, makeStyles } from '@fluentui/react-components'
import { useCallback } from 'react'

import type { ColumnNameData } from '../../features/columnsSlice'

import { getFormattedColumns, setMatchVisit } from '../../features/columnsSlice'

interface Props {
  alertRef: RefObject<AlertRef>
  item: ColumnNameData
}

const useClasses = makeStyles({
  root: {
    minWidth: '150px',
  },
})

const VisitsCell = ({ alertRef, item: { pos } }: Props) => {
  const classes = useClasses()
  const dispatch = useAppDispatch()

  const { visits } = useAppSelector(({ sheet }) => sheet)
  const { matchColumns, matchVisits } = useAppSelector(({ columns }) => columns)
  const column = matchColumns[pos] ?? ''
  const matchVisit = matchVisits[pos] ?? 0
  const formattedColumns = useAppSelector(getFormattedColumns)

  const handleOptionSelect: Required<DropdownProps>['onOptionSelect'] =
    useCallback(
      (_e, { optionValue }) => {
        const matchVisit = parseInt(optionValue ?? '0')

        if (formattedColumns.includes(column + '_' + matchVisit)) {
          console.log('too many of the same columns')

          alertRef.current?.openAlert()
          return
        }

        dispatch(setMatchVisit({ matchVisit, pos }))
      },
      [alertRef, column, dispatch, formattedColumns, pos],
    )

  return (
    <Dropdown
      appearance="filled-darker"
      className={classes.root}
      onOptionSelect={handleOptionSelect}
      selectedOptions={[matchVisit.toString()]}
      value={matchVisit.toString()}>
      {just(visits)(Array)(Array.from).convert(list)((_, i) => (
        <Option key={i} text={i.toString()}>
          {i}
        </Option>
      ))()}
    </Dropdown>
  )
}

export default VisitsCell
