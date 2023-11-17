/**
 * @file This file contains the visits cell component for the preview data grid.
 * @module components/data/VisitsCell
 */
import type { AlertRef } from '@/components/AlertDialog'
import type { DropdownProps } from '@fluentui/react-components'

import { indexDuplicateSearcher } from '@/lib/array'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setMatchVisit } from '@/reducers/matches'
import { getVisits } from '@/selectors/data/visits'
import { getIndices } from '@/selectors/matches/format'
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

import {
  selectMatchColumn,
  selectMatchVisit,
  selectVisitByMatchVisit,
} from './selectors'

const useClasses = makeStyles({
  root: {
    minWidth: '150px',
    ...shorthands.margin(0, tokens.spacingHorizontalS),
  },
})

/**
 * The props for {@link VisitsCell}.
 */
export interface Props {
  /**
   *
   */
  alertRef: RefObject<AlertRef>
  /**
   *
   */
  pos: number
}

/**
 * This function is used to render the visits cell in the data grid.
 * @param props - The {@link Props props} for the component.
 * @returns The compoonent object.
 * @example
 * ```tsx
 *  <VisitsCell alertRef={alertRef} pos={pos} />
 * ```
 */
export default function VisitsCell(props: Readonly<Props>) {
  const classes = useClasses()

  const { alertRef, pos } = props

  const dispatch = useAppDispatch()

  const visits = useAppSelector(getVisits)
  const matchColumn = useAppSelector(selectMatchColumn(props))
  const matchVisit = useAppSelector(selectMatchVisit(props))
  const visit = useAppSelector(selectVisitByMatchVisit(props))
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
