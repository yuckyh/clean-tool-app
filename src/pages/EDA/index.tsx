import Nav from '@/components/Nav'
import { columnStateStore } from '@/lib/StateStore/column'
import { useSyncExternalStore } from 'react'
import { Outlet } from 'react-router-dom'

const snakeToSlug = (str: string) => str.replace(/_/g, '-')

export const Component = () => {
  const selectedColumns = Array.from(
    useSyncExternalStore(
      columnStateStore.subscribe,
      () => columnStateStore.columns,
    ),
  )

  const paths = selectedColumns.map(snakeToSlug).map((slug) => `/EDA/${slug}`)

  return (
    <>
      <Nav vertical={true} paths={paths} />
      <Outlet />
    </>
  )
}

Component.displayName = 'EDA'
