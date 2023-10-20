import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import * as S from 'fp-ts/string'

const acronymizedTitleCase = (word: string) =>
  word.length > 3 ? word.replace(/^./, S.toUpperCase) : S.toUpperCase(word)

const kebabToTitle = (slug: string) =>
  pipe(
    slug,
    S.split('-'),
    RA.map(acronymizedTitleCase),
    RA.reduce('', (acc, cur) => S.Monoid.concat(acc, ` ${cur}`)),
  )

export const getPathTitle = (path: string, depth = 1) => {
  const result = pipe(
    path,
    S.split('/'),
    RA.takeRight(depth),
    RA.map(kebabToTitle),
    RA.reduce('', S.Monoid.concat),
  )

  return result.length > 1 ? result : 'Home'
}

export const strEquals = (str: string) => (other: string) =>
  S.Eq.equals(str, other)
