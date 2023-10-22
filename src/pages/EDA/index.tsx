/* eslint-disable import/prefer-default-export */
/* eslint-disable functional/functional-parameters */
// import { getFormattedFileName } from '@/features/sheet/selectors'
import { makeStyles, shorthands, tokens } from '@fluentui/react-components'
import { useBeforeUnload, Outlet } from 'react-router-dom'
import { useCallback } from 'react'
import { useAppDispatch } from '@/lib/hooks'
import { saveSheetState } from '@/features/sheet/reducers'
import Nav from '@/pages/EDA/Variable/Nav'
import * as IO from 'fp-ts/IO'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe, flow } from 'fp-ts/function'
import { saveColumnState } from '@/features/columns/reducers'

const useClasses = makeStyles({
  root: {
    columnGap: tokens.spacingVerticalXL,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    display: 'flex',
  },
})

// TODO: add visit detection prompt

export function Component() {
  const classes = useClasses()

  const dispatch = useAppDispatch()

  useBeforeUnload(
    useCallback(() => {
      return pipe(
        [saveColumnState, saveSheetState] as const,
        RA.map(flow((x) => dispatch(x()), IO.of)),
        IO.sequenceArray,
      )()
    }, [dispatch]),
  )

  // TODO: Sticky nav
  return (
    <div className={classes.root}>
      <Nav vertical />
      <Outlet />
    </div>
  )
}
