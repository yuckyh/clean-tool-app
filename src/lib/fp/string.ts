/**
 * @file This file contains the utilities for strings.
 */

import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'
import * as S from 'fp-ts/string'

/**
 * Utility function to acronymize a word if it is shorter than 3 characters. Otherwise, it will capitalize the first letter of the word.
 * @param word - The word to be acronymized.
 * @returns The acronymized word.
 * @example
 *  acronymizedTitleCase('foo') // 'FOO'
 */
const acronymizedTitleCase = (word: string) =>
  word.length > 3 ? word.replace(/^./, S.toUpperCase) : S.toUpperCase(word)

/**
 * Utility function to convert a kebab case string to a title case string.
 * @param slug - The kebab case string to be converted.
 * @returns The title case string.
 * @example
 *  kebabToTitle('foo-bar') // 'Foo Bar'
 */
const kebabToTitle = (slug: string) =>
  f.pipe(
    slug,
    S.split('-'),
    RA.map(acronymizedTitleCase),
    RA.reduce('', (acc, cur) => S.Monoid.concat(acc, ` ${cur}`)),
  )

/**
 * Utility function to convert a kebab case string to a snake case string.
 * @param slug - The kebab case string to be converted.
 * @returns The snake case string.
 * @example
 *  kebabToSnake('foo-bar') // 'foo_bar'
 */
export const kebabToSnake = S.replace(/-/g, '_')

/**
 * Utility function to convert a snake case string to a kebab case string.
 * @param slug - The snake case string to be converted.
 * @returns The kebab case string.
 * @example
 *  snakeToKebab('foo_bar') // 'foo-bar'
 */
export const snakeToKebab = S.replace(/_/g, '-')

/**
 * Utility function to convert a kebab case string to a title case string.
 * @param path - The kebab case string to be converted.
 * @param depth - The depth of the path to be converted.
 * @returns The title case string.
 * @example
 *  kebabToCamel('foo-bar') // 'Foo Bar'
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
