/**
 * @file This file contains the ProgressNavLink component.
 * @module components/progress/ProgressNav/Link
 */

import { getPathTitle } from '@/lib/fp/string'
import { useAppSelector } from '@/lib/hooks'
import {
  Link,
  Subtitle2,
  Subtitle2Stronger,
  makeStyles,
  mergeClasses,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import {
  useHref,
  useLinkClickHandler,
  useLocation,
  useResolvedPath,
} from 'react-router-dom'

import { selectIsDisabled } from '../../selectors'

const useClasses = makeStyles({
  activeStepThumb: {
    backgroundColor: tokens.colorCompoundBrandBackground,
  },
  link: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  linkText: {
    textAlign: 'center',
  },
  root: {
    display: 'flex',
    justifyContent: 'center',
    ...shorthands.flex(1),
  },
  stepThumb: {
    backgroundColor: tokens.colorNeutralBackground6,
    height: '20px',
    position: 'relative',
    top: '-12px',
    width: '20px',
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
    ...shorthands.transition('background-color', '0.2s', '0s', 'ease-in-out'),
  },
})

/**
 * The props for the {@link ProgressNavLink} component.
 */
interface Props {
  /**
   * Whether the link indicates that the step is done.
   */
  done: boolean
  /**
   * The path for the link.
   */
  path: string
  /**
   * The position of the link in the progress nav.
   */
  pos: number
}

/**
 * This component provides a link for the current progress navigation.
 * @param props - The {@link Props props} passed to the component.
 * @param props.done - Whether the link indicates that the step is done.
 * @param props.path - The path for the link.
 * @param props.pos - The position of the link in the progress nav.
 * @returns - The {@link Link} component.
 * @example
 * ```tsx
 *    <ProgressNavLink
 *      done={position >= pos}
 *      key={path}
 *      path={path}
 *      pos={pos}
 *    />
 * ```
 */
export default function ProgressNavLink({ done, path, pos }: Readonly<Props>) {
  const classes = useClasses()

  const { pathname: locationPath } = useLocation()
  const { pathname: componentPath } = useResolvedPath('')

  const isDisabled = useAppSelector(
    selectIsDisabled(componentPath, locationPath, pos),
  )
  const href = useHref(isDisabled ? '#' : path)
  const handleLinkClick = useLinkClickHandler(path)

  const label = getPathTitle(path)
  const isActive = useLocation().pathname === path

  return (
    <div className={classes.root}>
      <Link
        appearance="subtle"
        className={classes.link}
        disabled={isDisabled}
        href={href}
        onClick={handleLinkClick}>
        <div
          className={mergeClasses(
            classes.stepThumb,
            done ? classes.activeStepThumb : '',
          )}
        />
        {isActive ? (
          <Subtitle2Stronger className={classes.linkText}>
            {label}
          </Subtitle2Stronger>
        ) : (
          <Subtitle2 className={classes.linkText}>{label}</Subtitle2>
        )}
      </Link>
    </div>
  )
}
