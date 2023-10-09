import { useAppDispatch, useAppSelector, useAsyncEffect } from '@/lib/hooks'
import { getFormattedFileName } from '@/features/sheet/selectors'
import { makeStyles, tokens } from '@fluentui/react-components'
import { saveSheetState } from '@/features/sheet/reducers'
import { useBeforeUnload, Outlet } from 'react-router-dom'
import { fetchWorkbook } from '@/features/sheet/actions'
import { useCallback } from 'react'
import Nav from '@/components/Nav'

const useClasses = makeStyles({
  root: {
    columnGap: tokens.spacingVerticalXL,
    flexDirection: 'row',
    display: 'flex',
  },
})

// TODO: add visit detection prompt

export const Component = () => {
  const classes = useClasses()

  const dispatch = useAppDispatch()

  const formattedFileName = useAppSelector(getFormattedFileName)

  useAsyncEffect(async () => {
    await dispatch(fetchWorkbook(formattedFileName))
  }, [dispatch, formattedFileName])

  useBeforeUnload(
    useCallback(() => {
      dispatch(saveSheetState())
    }, [dispatch]),
  )

  return (
    <div className={classes.root}>
      <Nav vertical={true} />
      <Outlet />
    </div>
  )
}
