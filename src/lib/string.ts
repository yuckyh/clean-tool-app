import { string } from 'fp-ts'
import { takeRight, map } from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import { split } from 'fp-ts/string'

const acronymizedTitleCase = (word: string) =>
  word.length >= 3
    ? word.toLocaleUpperCase()
    : word.replace(/./, (c) => c.toUpperCase())

const kebabToTitle = (slug: string) =>
  slug.split('-').map(acronymizedTitleCase).join(' ')

export const getPathTitle = (path: string, depth = 1) => {
  const result = pipe(
    path,
    split('/'),
    takeRight(depth),
    map(kebabToTitle),
  ).join('')

  return result.length ? result : 'Home'
}

export const strEquals = (str: string) => (other: string) =>
  string.Eq.equals(str, other)
