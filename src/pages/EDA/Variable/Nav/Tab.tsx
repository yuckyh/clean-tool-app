/**
 * @file This file contains the Tab component for the Nav component.
 * @module pages/EDA/Variable/Nav/Tab
 */

import type { AppState } from '@/app/store'

import { useAppSelector } from '@/lib/hooks'
import { getColumnPath, getFormattedColumn } from '@/selectors/matches/format'
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
 * @param props
 * @param props.pos
 * @returns
 * @example
 */
const selectPath =
  ({ pos }: Readonly<Props>) =>
  (state: AppState) =>
    getColumnPath(state, pos)

/**
 *
 * @param props
 * @param props.pos
 * @returns
 * @example
 */
const selectLabel =
  ({ pos }: Readonly<Props>) =>
  (state: AppState) =>
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
 * This function renders the Tab component for the Nav component.
 * @param props - The {@link Props} object.
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
