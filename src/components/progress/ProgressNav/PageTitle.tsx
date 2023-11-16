/**
 * @file This file contains the progress navigation page title component.
 * @module components/progress/ProgressNav/PageTitle
 */

import type { AppState } from '@/app/store'

import { useAppSelector } from '@/lib/hooks'
import { getTitle } from '@/selectors/progress/paths'
import { Helmet } from 'react-helmet-async'

/**
 * The props for the {@link ProgressNavPageTitle} component.
 */
interface Props {
  /**
   * The progress nav's component path in the router.
   */
  componentPath: string
  /**
   * The current location path.
   */
  locationPath: string
}

const selectTitle =
  ({ componentPath, locationPath }: Readonly<Props>) =>
  (state: AppState) =>
    getTitle(state, componentPath, locationPath)

/**
 * This component provides the page title for the current progress navigation using react-helmet-async.
 * @param props - The {@link Props props} passed to the component.
 * @returns - The {@link Helmet} component.
 * @example
 * ```tsx
 *  <ProgressNavPageTitle
 *    componentPath={componentPath}
 *    locationPath={locationPath}
 *  />
 * ```
 */
export default function ProgressNavPageTitle(props: Readonly<Props>) {
  const title = useAppSelector(selectTitle(props))

  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  )
}
