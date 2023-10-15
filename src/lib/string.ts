import {
  capitalize,
  toLength,
  toUpper,
  split,
  slice,
  join,
  flow,
  map,
  gte,
} from 'lodash/fp'

const acronymizedTitleCase = (word: string) =>
  gte(3)(toLength(word)) ? toUpper(word) : capitalize(word)

const kebabToTitle = (slug: string) =>
  flow(split('-'), map(acronymizedTitleCase), join(' '))(slug)

// eslint-disable-next-line import/prefer-default-export
export const getPathTitle = (path: string, depth = 1) => {
  const result = flow(
    split('/'),
    slice(-1 * depth - 1)(path.length),
    map(kebabToTitle),
    join(' '),
  )(path)

  return result.length ? result : 'Home'
}
