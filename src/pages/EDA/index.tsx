import {
  getFormattedFileName,
  getColumnsPath,
} from '@/features/sheet/selectors'
import { makeStyles, tokens } from '@fluentui/react-components'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { fetchWorkbook } from '@/features/sheet/actions'
import { Outlet } from 'react-router-dom'
import Nav from '@/components/Nav'
import { useEffect } from 'react'

const useClasses = makeStyles({
  root: {
    columnGap: tokens.spacingVerticalXL,
    flexDirection: 'row',
    display: 'flex',
  },
})

export const Component = () => {
  const classes = useClasses()

  const dispatch = useAppDispatch()

  const formattedFileName = useAppSelector(getFormattedFileName)
  const paths = useAppSelector((state) => getColumnsPath(state, false))

  useEffect(() => {
    void dispatch(fetchWorkbook(formattedFileName))
  }, [dispatch, formattedFileName])

  return (
    <div className={classes.root}>
      <Nav vertical={true} paths={paths} />
      <Outlet />
    </div>
  )
}

Component.displayName = 'EDA'
