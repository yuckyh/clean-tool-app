/**
 * @file This file contains the Tab component for the EDA variable nav component.
 * @module pages/EDA/Variable/Nav/Tab
 */

import { useAppSelector } from '@/lib/hooks'
import { Link, Tab, makeStyles } from '@fluentui/react-components'
import { useHref, useLinkClickHandler } from 'react-router-dom'

import { selectLabel, selectPath } from './selectors'

const useClasses = makeStyles({
  root: {
    minHeight: '32px',
    overflowY: 'visible',
  },
})

/**
 * The props for the {@link NavTab} component.
 */
export interface Props {
  /**
   * The position of the column.
   */
  pos: number
}

/**
 * This function renders the Tab component for the Nav component.
 * @param props - The {@link Props props} for the component.
 * @returns The component obj
 * @example
 * ```tsx
 *  <NavTab pos={0} />
 * ```
 */
export default function NavTab(props: Readonly<Props>) {
  const classes = useClasses()

  const path = useAppSelector(selectPath(props))
  const label = useAppSelector(selectLabel(props))
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
