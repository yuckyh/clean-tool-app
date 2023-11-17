/**
 * @file This file contains the progress navigation component.
 * @module components/progress/ProgressNav
 */

import {
  useBodyThemeContext,
  useNavigateMiddleware,
  useRedirectSaveState,
  useUnloadSaveState,
} from '@/hooks/progress'
import {
  makeStyles,
  shorthands,
  tokens,
  useRestoreFocusTarget,
} from '@fluentui/react-components'
import { useLocation, useResolvedPath } from 'react-router-dom'

import ProgressNavBar from './Bar'
import ProgressNavLinks from './Links'
import ProgressNavPageTitle from './PageTitle'

const useClasses = makeStyles({
  linkContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.padding(tokens.spacingVerticalS, 0),
  },
})

/**
 * The progress navigation component
 *
 * This components is used as the main navigation with the functionality of showing the user's progress
 * @see {@link ProgressNavBar} for details on the bar's functionality
 * @returns The component object
 * @category Component
 * @example
 * ```tsx
 * <ProgressNav />
 * ```
 */
export default function ProgressNav() {
  const classes = useClasses()

  const { pathname: componentPath } = useResolvedPath('')
  const { pathname: locationPath } = useLocation()
  const restoreFocusTargetAttribute = useRestoreFocusTarget()

  useRedirectSaveState()
  useNavigateMiddleware()
  useBodyThemeContext()
  useUnloadSaveState()

  return (
    <div className={classes.root}>
      <ProgressNavPageTitle
        componentPath={componentPath}
        locationPath={locationPath}
      />
      <ProgressNavBar {...restoreFocusTargetAttribute} />
      <ProgressNavLinks
        componentPath={componentPath}
        locationPath={locationPath}
      />
    </div>
  )
}
