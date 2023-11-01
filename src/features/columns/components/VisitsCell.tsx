import type { AlertRef } from '@/components/AlertDialog'
import type { DropdownProps } from '@fluentui/react-components'

import { indexDuplicateSearcher } from '@/lib/array'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
  Dropdown,
  Option,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import * as IO from 'fp-ts/IO'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'
import { type RefObject, useCallback } from 'react'

import { setMatchVisit } from '../reducers'
import { getIndices, getMatchVisit, getVisitByMatchVisit } from '../selectors'
import { getMatchColumn } from '@/selectors/columnsSelectors'

const useClasses = makeStyles({
  root: {
    minWidth: '150px',
    ...shorthands.margin(0, tokens.spacingHorizontalS),
  },
})

interface Props {
  alertRef: RefObject<AlertRef>
  pos: number
}

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
          alertRef.current?.open()
          return
        }

        f.pipe(
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
      appearance="filled-darker"
      className={classes.root}
      onOptionSelect={handleOptionSelect}
      selectedOptions={[matchVisit.toString()]}
      value={visit}>
      {f.pipe(
        visits,
        RA.mapWithIndex((i, visitStr) => (
          <Option key={visitStr} text={visitStr} value={i.toString()}>
            {visitStr}
          </Option>
        )),
      )}
    </Dropdown>
  )
}
