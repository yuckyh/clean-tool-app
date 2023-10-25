import { useAppSelector } from '@/lib/hooks'
import { getPathTitle } from '@/lib/string'
import {
  Link,
  Subtitle2,
  Subtitle2Stronger,
  makeStyles,
  mergeClasses,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import { useMemo } from 'react'
import {
  useHref,
  useLinkClickHandler,
  useLocation,
  useResolvedPath,
} from 'react-router-dom'

import { getDisabled } from '../selectors'

interface Props {
  done: boolean
  path: string
  pos: number
}

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

export default function ProgressNavLink({ done, path, pos }: Props) {
  const classes = useClasses()

  const { pathname: locationPath } = useLocation()
  const { pathname: componentPath } = useResolvedPath('')

  const params = useMemo(
    () => [componentPath, locationPath, pos] as const,
    [componentPath, locationPath, pos],
  )

  const disabled = useAppSelector((state) => getDisabled(state, ...params))
  const href = useHref(disabled ? '#' : path)
  const handleLinkClick = useLinkClickHandler(path)

  // const selectedPath = useAppSelector((state) => getPath(state, ...params))

  const label = getPathTitle(path)
  const isActive = useLocation().pathname === path

  return (
    <div className={classes.root}>
      <Link
        appearance="subtle"
        className={classes.link}
        disabled={disabled}
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
