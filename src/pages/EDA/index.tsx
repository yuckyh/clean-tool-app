/* eslint-disable import/prefer-default-export */
/* eslint-disable functional/functional-parameters */
// import { getFormattedFileName } from '@/features/sheet/selectors'
import { makeStyles, tokens } from '@fluentui/react-components'
import { Outlet } from 'react-router-dom'
import Nav from '@/pages/EDA/Variable/Nav'

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

  return (
    <div className={classes.root}>
      <Nav vertical />
      <Outlet />
    </div>
  )
}
