// import { getFormattedFileName } from '@/features/sheet/selectors'
import { makeStyles, tokens } from '@fluentui/react-components'
import { useBeforeUnload, Outlet } from 'react-router-dom'
import { useCallback } from 'react'
import { useAppDispatch } from '@/lib/hooks'
import { saveSheetState } from '@/features/sheet/reducers'
import Nav from '@/pages/EDA/Variable/Nav'
import { just } from '@/lib/monads'

const useClasses = makeStyles({
  root: {
    columnGap: tokens.spacingVerticalXL,
    flexDirection: 'row',
    display: 'flex',
  },
})

// TODO: add visit detection prompt

// eslint-disable-next-line import/prefer-default-export
export function Component() {
  const classes = useClasses()

  const dispatch = useAppDispatch()

  useBeforeUnload(
    useCallback(() => {
      just(saveSheetState).pass()(dispatch)
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
