import {
  Subtitle2Stronger,
  mergeClasses,
  makeStyles,
  shorthands,
  Subtitle2,
  tokens,
  Link,
} from '@fluentui/react-components'
import {
  useLinkClickHandler,
  useResolvedPath,
  useLocation,
  useHref,
} from 'react-router-dom'
import { useMemo } from 'react'
import { getPathTitle } from '@/lib/string'
import { useAppSelector } from '@/lib/hooks'
import { getDisabled } from '../selectors'

interface Props {
  done: boolean
  path: string
  pos: number
}

const useClasses = makeStyles({
  stepThumb: {
    backgroundColor: tokens.colorNeutralBackground6,
    position: 'relative',
    height: '20px',
    width: '20px',
    top: '-12px',
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
    ...shorthands.transition('background-color', '0.2s', '0s', 'ease-in-out'),
  },
  root: {
    justifyContent: 'center',
    display: 'flex',
    ...shorthands.flex(1),
  },
  link: {
    flexDirection: 'column',
    alignItems: 'center',
    display: 'flex',
  },
  activeStepThumb: {
    backgroundColor: tokens.colorCompoundBrandBackground,
  },
  linkText: {
    textAlign: 'center',
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
        onClick={handleLinkClick}
        className={classes.link}
        appearance="subtle"
        disabled={disabled}
        href={href}>
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
