import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'
import * as S from 'fp-ts/string'

/**
 *
 * @param word
 * @returns
 * @example
 */
const acronymizedTitleCase = (word: string) =>
  word.length > 3 ? word.replace(/^./, S.toUpperCase) : S.toUpperCase(word)

/**
 *
 * @param slug
 * @returns
 * @example
 */
const kebabToTitle = (slug: string) =>
  f.pipe(
    slug,
    S.split('-'),
    RA.map(acronymizedTitleCase),
    RA.reduce('', (acc, cur) => S.Monoid.concat(acc, ` ${cur}`)),
  )

/**
 *
 */
export const kebabToSnake = S.replace(/-/g, '_')

/**
 *
 */
export const snakeToKebab = S.replace(/_/g, '-')

/**
 *
 * @param path
 * @param depth
 * @returns
 * @example
 */
export const getPathTitle = (path: string, depth = 1) => {
  const result = f.pipe(
    path,
    S.split('/'),
    RA.takeRight(depth),
    RA.map(kebabToTitle),
    RA.reduce('', S.Monoid.concat),
  )

  return result.length > 1 ? result : 'Home'
}
