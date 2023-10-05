import { useLocation, useHref } from 'react-router-dom'

export const usePathTitle = (path?: string) => {
  const { pathname } = useLocation()

  const result = useHref(path ?? pathname)
    .match(/[^/]*$/)?.[0]
    .split('-')
    .map((word) =>
      word.length <= 3
        ? word.toUpperCase()
        : word.replace(/^\w/, (c) => c.toUpperCase()),
    )
    .join(' ')

  return result?.length ? result : 'Home'
}
export const slugToSnake = (str: string) => str.replace(/-/g, '_')
