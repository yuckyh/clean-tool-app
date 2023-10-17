import type { DropdownProps } from '@fluentui/react-components'
import { makeStyles, Dropdown, Option } from '@fluentui/react-components'
import { type RefObject, useCallback } from 'react'
import { range, flow, map, zip } from 'lodash/fp'
import type { AlertRef } from '@/components/AlertDialog'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { indexDuplicateSearcher } from '@/lib/array'

import { just } from '@/lib/monads'
import {
  getMatchColumn,
  getMatchVisit,
  getIndices,
  getVisit,
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

export default function VisitsCell({ alertRef, pos }: Props) {
  const classes = useClasses()

  const dispatch = useAppDispatch()

  const visits = useAppSelector(({ sheet }) => sheet.visits)
  const matchColumn = useAppSelector((state) => getMatchColumn(state, pos))
  const matchVisit = useAppSelector((state) => getMatchVisit(state, pos))
  const visit = useAppSelector((state) => getVisit(state, pos))
  const indices = useAppSelector(getIndices)

  const handleOptionSelect: Required<DropdownProps>['onOptionSelect'] =
    useCallback(
      (_e, { optionValue }) => {
        const newMatchVisit = parseInt(optionValue ?? '1', 10)

        if (newMatchVisit === matchVisit) {
          return
        }

        if (
          indexDuplicateSearcher(indices, [matchColumn, newMatchVisit]).length
        ) {
          alertRef.current?.setContent(
            'You have selected the same column multiple times. Changes will not be made.',
          )
          alertRef.current?.setTitle('Column Matching Error')
          alertRef.current?.open()
          return
        }

        just({ matchVisit: newMatchVisit, pos })(setMatchVisit)(dispatch)
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
      {flow(
        zip(range(0)(visits.length)),
        map<[number, string], JSX.Element>(([i = 0, visitStr = '']) => (
          <Option value={i.toString()} text={visitStr} key={visitStr}>
            {visitStr}
          </Option>
        )),
      )(visits)}
    </Dropdown>
  )
}
