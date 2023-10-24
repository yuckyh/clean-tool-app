import type { DropdownProps } from '@fluentui/react-components'
import {
  makeStyles,
  shorthands,
  Dropdown,
  Option,
  tokens,
} from '@fluentui/react-components'
import { type RefObject, useCallback } from 'react'
import type { AlertRef } from '@/components/AlertDialog'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { indexDuplicateSearcher } from '@/lib/array'

import * as IO from 'fp-ts/IO'
import { pipe } from 'fp-ts/function'
import * as RA from 'fp-ts/ReadonlyArray'
import {
  getMatchColumn,
  getMatchVisit,
  getIndices,
  getVisitByMatchVisit,
} from '../selectors'
import { setMatchVisit } from '../reducers'

interface Props {
  alertRef: RefObject<AlertRef>
  pos: number
}

const useClasses = makeStyles({
  root: {
    minWidth: '150px',
    ...shorthands.margin(0, tokens.spacingHorizontalS),
  },
})

export default function VisitsCell({ alertRef, pos }: Props) {
  const classes = useClasses()

  const dispatch = useAppDispatch()

  const visits = useAppSelector(({ sheet }) => sheet.visits)
  const matchColumn = useAppSelector((state) => getMatchColumn(state, pos))
  const matchVisit = useAppSelector((state) => getMatchVisit(state, pos))
  const visit = useAppSelector((state) => getVisitByMatchVisit(state, pos))
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

        return pipe(
          { matchVisit: newMatchVisit, pos },
          setMatchVisit,
          (x) => dispatch(x),
          IO.of,
        )()
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
      {pipe(
        visits,
        RA.mapWithIndex((i, visitStr) => (
          <Option value={i.toString()} text={visitStr} key={visitStr}>
            {visitStr}
          </Option>
        )),
      )}
    </Dropdown>
  )
}
