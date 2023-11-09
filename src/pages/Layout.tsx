/**
 * @file This file is for the main layout component.
 * @module pages/Layout
 */

/* eslint-disable
  functional/functional-parameters
*/
import Loader from '@/components/Loader'
import ProgressNav from '@/features/progress/components/ProgressNav'
import {
  Spinner,
  Subtitle1,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import { useMemo } from 'react'
import { Outlet, useNavigation } from 'react-router-dom'

const useClasses = makeStyles({
  header: {
    ...shorthands.padding(tokens.spacingVerticalXXL),
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.padding(tokens.spacingVerticalXXXL),
  },
})

/**
 * This component is used to render the progress navigation bar and the main content of the page.
 * @category Component
 * @returns The main layout component
 * @example
 * ```tsx
 * <Layout />
 * ```
 */
export default function Layout() {
  const classes = useClasses()

  const navigation = useNavigation()

  const loading = useMemo(
    () => navigation.state === 'loading',
    [navigation.state],
  )

  return (
    <>
      <header className={classes.header}>
        <ProgressNav />
      </header>
      <main className={classes.main}>
        <Loader
          label={<Subtitle1>Loading...</Subtitle1>}
          labelPosition="below"
          size="huge">
          {loading ? (
            <Spinner
              label={<Subtitle1>Loading...</Subtitle1>}
              labelPosition="below"
              size="huge"
            />
          ) : (
            <Outlet />
          )}
        </Loader>
      </main>
    </>
  )
}
