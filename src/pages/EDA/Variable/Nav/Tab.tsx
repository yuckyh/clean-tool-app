import { makeStyles, Link, Tab } from '@fluentui/react-components'
import { useLinkClickHandler, useHref } from 'react-router-dom'
import { getColumnPath } from '@/features/columns/selectors'
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

  const label = path.split('/').slice(2).join('_').replace(/-/g, '_')
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
