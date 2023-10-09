import type { DropdownProps } from '@fluentui/react-components'
import type { AlertRef } from '@/components/AlertDialog'

import { makeStyles, Dropdown, Option } from '@fluentui/react-components'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { indexDuplicateSearcher } from '@/lib/array'
import { type RefObject, useCallback } from 'react'

import { getMatchColumn, getMatchVisit, getIndices } from '../selectors'
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
  const indices = useAppSelector(getIndices)

  const handleOptionSelect: Required<DropdownProps>['onOptionSelect'] =
    useCallback(
      (_e, { optionValue }) => {
        const newMatchVisit = parseInt(optionValue ?? '1')

        if (newMatchVisit === matchVisit) {
          return
        }

        if (
          indexDuplicateSearcher(indices, [matchColumn, newMatchVisit] as const)
            .length
        ) {
          alertRef.current?.setContent(
            'You have selected the same column multiple times. Changes will not be made.',
          )
          alertRef.current?.setTitle('Column Matching Error')
          alertRef.current?.open()
          return
        }

        dispatch(setMatchVisit({ matchVisit: newMatchVisit, pos }))
      },
      [alertRef, dispatch, indices, matchColumn, matchVisit, pos],
    )

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
