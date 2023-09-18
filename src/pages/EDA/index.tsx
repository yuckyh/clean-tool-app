import Nav from '@/components/Nav'
import { useAppSelector } from '@/hooks'
import { Outlet } from 'react-router-dom'

const snakeToSlug = (str: string) => str.replace(/_/g, '-')

export const Component = () => {
  const { columns } = useAppSelector(({ columns }) => columns)

  const paths = columns.map(snakeToSlug).map((slug) => `/EDA/${slug}`)

  return (
    <>
      <Nav paths={paths} vertical={true} />
      <Outlet />
    </>
  )
}

Component.displayName = 'EDA'
