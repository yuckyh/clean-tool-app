/* eslint-disable import/prefer-default-export */
/* eslint-disable functional/functional-parameters */
import Nav from '@/pages/EDA/Variable/Nav'
import { makeStyles, tokens } from '@fluentui/react-components'
import { Outlet } from 'react-router-dom'

const useClasses = makeStyles({
  root: {
    columnGap: tokens.spacingVerticalXL,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
})

export function Component() {
  const classes = useClasses()

  return (
    <div className={classes.root}>
      <Nav />
      <Outlet />
    </div>
  )
}
