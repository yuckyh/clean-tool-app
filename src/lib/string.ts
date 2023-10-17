import { string } from 'fp-ts'

const acronymizedTitleCase = (word: string) =>
  word.length >= 3
    ? word.toLocaleUpperCase()
    : word.replace(/./, (c) => c.toUpperCase())

const kebabToTitle = (slug: string) =>
  slug.split('-').map(acronymizedTitleCase).join(' ')

export const getPathTitle = (path: string, depth = 1) => {
  const result = path
    .split('/')
    .slice(-1 * depth)
    .map(kebabToTitle)
    .join(' ')

  return result.length ? result : 'Home'
}

export function localeCompare(acc: number | string, prev: string): number {
  return typeof acc === 'string' ? acc.localeCompare(prev) : acc
}

export const strEquals = (str: string) => (other: string) =>
  string.Eq.equals(str, other)
