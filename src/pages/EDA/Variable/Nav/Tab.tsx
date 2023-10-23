import { makeStyles, Link, Tab } from '@fluentui/react-components'
import { useLinkClickHandler, useHref } from 'react-router-dom'
import { getFormattedColumn, getColumnPath } from '@/features/columns/selectors'
import { useAppSelector } from '@/lib/hooks'

interface Props {
  pos: number
}

const useClasses = makeStyles({
  root: {
    overflowY: 'visible',
    minHeight: '32px',
  },
})

export default function NavTab({ pos }: Props) {
  const classes = useClasses()
  const path = useAppSelector((state) => getColumnPath(state, pos))

  const label = useAppSelector((state) => getFormattedColumn(state, pos))
  const href = useHref(path)

  const handleLinkClick = useLinkClickHandler(path)

  return (
    <Link
      onClick={handleLinkClick}
      className={classes.root}
      appearance="subtle"
      href={href}>
      <Tab value={path}>{label}</Tab>
    </Link>
  )
}
