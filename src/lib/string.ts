const acronymizedTitleCase = (word: string) =>
  word.length >= 3
    ? word.toLocaleUpperCase()
    : word.replace(/./, (c) => c.toUpperCase())

const kebabToTitle = (slug: string) =>
  slug.split('-').map(acronymizedTitleCase).join(' ')

// eslint-disable-next-line import/prefer-default-export
export const getPathTitle = (path: string, depth = 1) => {
  const result = path
    .split('/')
    .slice(-1 * depth)
    .map(kebabToTitle)
    .join(' ')

  return result.length ? result : 'Home'
}
