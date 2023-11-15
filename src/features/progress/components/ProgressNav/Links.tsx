/**
 * @file This file contains the ProgressNavLinks component.
 * @module components/progress/ProgressNav/Links
 */

import { useAppSelector } from '@/lib/hooks'
import { makeStyles } from '@fluentui/react-components'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'

import { selectPaths, selectPosition } from '../../selectors'
import ProgressNavLink from './Link'

const useClasses = makeStyles({
  linkContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
})

/**
 * The props for the {@link ProgressNavLinks} component.
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
 * This component provides the links for the current progress navigation.
 * @param props - The {@link Props props} passed to the component.
 * @param props.componentPath - The progress nav's component path in the router.
 * @param props.locationPath - The current location path.
 * @returns - The {@link ProgressNavLink} components.
 * @example
 * ```tsx
 *    <ProgressNavLinks
 *      componentPath={componentPath}
 *      locationPath={locationPath}
 *    />
 */
export default function ProgressNavLinks({
  componentPath,
  locationPath,
}: Readonly<Props>) {
  const classes = useClasses()

  const paths = useAppSelector(selectPaths(componentPath))
  const position = useAppSelector(selectPosition(componentPath, locationPath))

  return (
    <div className={classes.linkContainer}>
      {f.pipe(
        paths,
        RA.mapWithIndex((pos, path) => (
          <ProgressNavLink
            done={position >= pos}
            key={path}
            path={path}
            pos={pos}
          />
        )),
      )}
    </div>
  )
}
