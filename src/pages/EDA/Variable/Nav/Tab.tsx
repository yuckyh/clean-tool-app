import { Link, Tab } from '@fluentui/react-components'
import { useLinkClickHandler, useHref } from 'react-router-dom'
import { snakeCase, slice, split, flow, join } from 'lodash/fp'
import { getColumnPath } from '@/features/columns/selectors'
import { useAppSelector } from '@/lib/hooks'

interface Props {
  pos: number
}

export default function NavTab({ pos }: Props) {
  const path = useAppSelector((state) => getColumnPath(state, pos))

  const label = flow(
    split('/'),
    slice(2)(path.length),
    join('_'),
    snakeCase,
  )(path)
  const href = useHref(path)

  const handleLinkClick = useLinkClickHandler(path)

  return (
    <Link onClick={handleLinkClick} appearance="subtle" href={href}>
      <Tab value={path}>{label}</Tab>
    </Link>
  )
}
