import { useHref, useLocation } from 'react-router-dom'

export const getFormattedFileName = (fileName: string) => {
  const fileNameArray = fileName.split('.')
  const ext = fileNameArray.pop()
  return `${fileNameArray.join('.')}.formatted.${ext}`
}

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
