import type { LinkProps } from 'react-router-dom'

import {
  Subtitle2Stronger,
  mergeClasses,
  makeStyles,
  shorthands,
  Subtitle2,
  tokens,
  Link,
} from '@fluentui/react-components'
import { useLinkClickHandler, useHref } from 'react-router-dom'
import { postFormattedJSON } from '@/features/sheet/actions'
import { useAppDispatch } from '@/lib/hooks'
import { getPathTitle } from '@/lib/string'
import { useCallback } from 'react'

interface Props {
  disabled: boolean
  done: boolean
  path: string
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

const ProgressNavLink = ({ disabled, done, path }: Props) => {
  const classes = useClasses()

  const dispatch = useAppDispatch()

  const label = getPathTitle(path)
  const href = useHref(disabled ? '#' : path)
  const isActive = href === path
  const linkClickHandler = useLinkClickHandler(path)

  const handleLinkClick: Required<LinkProps>['onClick'] = useCallback(
    (e) => {
      linkClickHandler(e)

      path.includes('/eda') && void dispatch(postFormattedJSON())
    },
    [dispatch, linkClickHandler, path],
  )

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

export default ProgressNavLink
