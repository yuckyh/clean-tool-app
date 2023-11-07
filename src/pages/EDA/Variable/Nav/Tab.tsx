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

export interface Props {
  pos: number
}

/**
 *
 * @param props
 * @param props.pos
 */
export default function NavTab({ pos }: Readonly<Props>) {
  const classes = useClasses()
  const path = useAppSelector((state) => getColumnPath(state, pos))

  const label = useAppSelector((state) => getFormattedColumn(state, pos))
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
