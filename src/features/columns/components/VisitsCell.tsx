import type { AppState } from '@/app/store'
import type { AlertRef } from '@/components/AlertDialog'
import type { DropdownProps } from '@fluentui/react-components'

import { getVisits } from '@/app/selectors'
import { indexDuplicateSearcher } from '@/lib/array'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { getMatchColumn } from '@/selectors/columns/selectors'
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

/**
 *
 * @param props
 * @param props.pos
 * @returns
 * @example
 */
const selectMatchColumn =
  ({ pos }: Readonly<Props>) =>
  (state: AppState) =>
    getMatchColumn(state, pos)

/**
 *
 * @param props
 * @param props.pos
 * @returns
 * @example
 */
const selectMatchVisit =
  ({ pos }: Readonly<Props>) =>
  (state: AppState) =>
    getMatchVisit(state, pos)

/**
 *
 * @param props
 * @param props.pos
 * @returns
 * @example
 */
const selectVisitByMatchVisit =
  ({ pos }: Readonly<Props>) =>
  (state: AppState) =>
    getVisitByMatchVisit(state, pos)

/**
 *
 * @param props
 * @param props.alertRef
 * @param props.pos
 * @example
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
