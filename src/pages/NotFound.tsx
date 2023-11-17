/**
 * @file This file is for the 404 page component.
 * @module pages/NotFound
 */

import { Link, Subtitle1, Title1, makeStyles } from '@fluentui/react-components'
import { useHref } from 'react-router-dom'

const useClasses = makeStyles({
  root: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: '100vh',
  },
})

/**
 * The 404 page component
 * @returns The component object
 * @category Page
 * @example
 * ```tsx
 *  <Route lazy={defaultLazyComponent(import('../pages'))} />
 * ```
 */
export default function NotFound() {
  const classes = useClasses()

  const href = useHref('/')

  return (
    <div className={classes.root}>
      <Title1>404 Not Found</Title1>
      <Subtitle1>The page you are looking for does not exist.</Subtitle1>
      <Link href={href}>Return to home</Link>
    </div>
  )
}
