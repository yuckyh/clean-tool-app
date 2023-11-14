import type { AppState } from '@/app/store'

import { getIsDisabled } from '@/features/progress/selectors'
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
 *
 * @param componentPath
 * @param locationPath
 * @param pos
 * @returns
 * @example
 */
const selectIsDisabled =
  (componentPath: string, locationPath: string, pos: number) =>
  (state: AppState) =>
    getIsDisabled(state, componentPath, locationPath, pos)

/**
 *
 */
interface Props {
  /**
   *
   */
  done: boolean
  /**
   *
   */
  path: string
  /**
   *
   */
  pos: number
}

/**
 *
 * @param props
 * @param props.done
 * @param props.path
 * @param props.pos
 * @example
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
