/* eslint-disable import/prefer-default-export */
/* eslint-disable functional/functional-parameters */
// import { getFormattedFileName } from '@/features/sheet/selectors'
import { makeStyles, tokens } from '@fluentui/react-components'
import { useBeforeUnload, Outlet } from 'react-router-dom'
import { useCallback } from 'react'
import { useAppDispatch } from '@/lib/hooks'
import { saveSheetState } from '@/features/sheet/reducers'
import Nav from '@/pages/EDA/Variable/Nav'
import IO from 'fp-ts/IO'
import { pipe } from 'fp-ts/function'

const useClasses = makeStyles({
  root: {
    columnGap: tokens.spacingVerticalXL,
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
      return pipe(saveSheetState(), (x) => dispatch(x), IO.of)()
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
