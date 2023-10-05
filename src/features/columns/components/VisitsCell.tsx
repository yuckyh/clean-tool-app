import type { DropdownProps } from '@fluentui/react-components'
import type { AlertRef } from '@/components/AlertDialog'
import type { RefObject } from 'react'

import { makeStyles, Dropdown, Option } from '@fluentui/react-components'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'

import {
  getIndexDuplicateSearcher,
  getMatchColumn,
  getMatchVisit,
} from '../selectors'
import { setMatchVisit } from '../reducers'

interface Props {
  alertRef: RefObject<AlertRef>
  pos: number
}

const useClasses = makeStyles({
  root: {
    minWidth: '150px',
  },
})

const VisitsCell = ({ alertRef, pos }: Props) => {
  const classes = useClasses()

  const dispatch = useAppDispatch()

  const visits = useAppSelector(({ sheet }) => sheet.visits)
  const matchColumn = useAppSelector((state) => getMatchColumn(state, pos))
  const matchVisit = useAppSelector((state) => getMatchVisit(state, pos))
  const visit = useAppSelector(({ sheet }) => sheet.visits[matchVisit] ?? '')
  const indexDuplicateSearcher = useAppSelector(getIndexDuplicateSearcher)

  const handleOptionSelect: DropdownProps['onOptionSelect'] = (
    _e,
    { optionValue },
  ) => {
    const newMatchVisit = parseInt(optionValue ?? '1')

    if (newMatchVisit === matchVisit) {
      return
    }

    if (indexDuplicateSearcher([matchColumn, newMatchVisit]).length) {
      console.log('too many of the same columns')

      alertRef.current?.open()
      return
    }

    dispatch(setMatchVisit({ matchVisit: newMatchVisit, pos }))
  }

  return (
    <Dropdown
      selectedOptions={[matchVisit.toString()]}
      onOptionSelect={handleOptionSelect}
      appearance="filled-darker"
      className={classes.root}
      value={visit}>
      {visits.map((visit, i) => (
        <Option text={visit.toString()} value={i.toString()} key={visit}>
          {visit}
        </Option>
      ))}
    </Dropdown>
  )
}

export default VisitsCell
