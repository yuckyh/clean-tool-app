/**
 * @file This file contains the progress navigation page title component.
 * @module components/progress/ProgressNav/PageTitle
 */

import { useAppSelector } from '@/lib/hooks'
import { Helmet } from 'react-helmet-async'

import { selectTitle } from './selectors'

/**
 * The props for the {@link ProgressNavPageTitle}.
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

/**
 * This component provides the page title for the current progress navigation using react-helmet-async.
 * @param props - The {@link Props props} for the component.
 * @param props.componentPath - The progress nav's component path in the router.
 * @param props.locationPath - The current location path.
 * @returns - The {@link Helmet} component.
 * @example
 * ```tsx
 *  <ProgressNavPageTitle
 *    componentPath={componentPath}
 *    locationPath={locationPath}
 *  />
 * ```
 */
export default function ProgressNavPageTitle({
  componentPath,
  locationPath,
}: Readonly<Props>) {
  const title = useAppSelector(selectTitle(componentPath, locationPath))

  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  )
}
