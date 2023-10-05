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
import { usePathTitle } from '@/lib/string'

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
})

const ProgressNavLink = ({ disabled, done, path }: Props) => {
  const classes = useClasses()

  const dispatch = useAppDispatch()

  const label = usePathTitle(path)
  const href = useHref(disabled ? '#' : path)
  const isActive = href === path
  const handleLinkClick = useLinkClickHandler(href)

  return (
    <div className={classes.root}>
      <Link
        onClick={(e) => {
          handleLinkClick(e)

          if (path.includes('/EDA')) {
            void dispatch(postFormattedJSON())
          }
        }}
        className={classes.link}
        appearance="subtle"
        disabled={disabled}>
        <>
          <div
            className={mergeClasses(
              classes.stepThumb,
              done ? classes.activeStepThumb : '',
            )}
          />
          {isActive ? (
            <Subtitle2Stronger>{label}</Subtitle2Stronger>
          ) : (
            <Subtitle2>{label}</Subtitle2>
          )}
        </>
      </Link>
    </div>
  )
}

export default ProgressNavLink
