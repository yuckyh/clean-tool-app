import type { AppState } from '@/app/store'

import { getColumnPath, getFormattedColumn } from '@/features/columns/selectors'
import { useAppSelector } from '@/lib/hooks'
import { Link, Tab, makeStyles } from '@fluentui/react-components'
import { useHref, useLinkClickHandler } from 'react-router-dom'

const useClasses = makeStyles({
  root: {
    minHeight: '32px',
    overflowY: 'visible',
  },
})

/**
 *
 * @param pos
 * @returns
 * @example
 */
const selectPath = (pos: number) => (state: AppState) =>
  getColumnPath(state, pos)

/**
 *
 * @param pos
 * @returns
 * @example
 */
const selectLabel = (pos: number) => (state: AppState) =>
  getFormattedColumn(state, pos)

/**
 *
 */
interface Props {
  /**
   *
   */
  pos: number
}

/**
 *
 * @param props
 * @param props.pos
 * @example
 */
export default function NavTab({ pos }: Readonly<Props>) {
  const classes = useClasses()
  const path = useAppSelector(selectPath(pos))

  const label = useAppSelector(selectLabel(pos))
  const href = useHref(path)

  const handleLinkClick = useLinkClickHandler(path)

  return (
    <Link
      appearance="subtle"
      className={classes.root}
      href={href}
      onClick={handleLinkClick}>
      <Tab value={path}>{label}</Tab>
    </Link>
  )
}
