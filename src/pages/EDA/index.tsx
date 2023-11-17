/**
 * @file This file contains the EDA page component.
 * @module pages/EDA
 */

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

/**
 * The EDA page is where the users can explore the data to flag any potential issues.
 * @returns The component object.
 * @category Page
 * @example
 * ```tsx
 *  <Route lazy={defaultLazyComponent(import('../pages/EDA'))} />
 * ```
 */
export default function EDA() {
  const classes = useClasses()

  return (
    <div className={classes.root}>
      <Nav />
      <Outlet />
    </div>
  )
}
