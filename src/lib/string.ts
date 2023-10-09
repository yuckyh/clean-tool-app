export const getPathTitle = (path: string, depth = 1) => {
  const result = path
    .split('/')
    .slice(-1 * depth)
    .map(slugToTitle)
    .join(' ')

  return result.length ? result : 'Home'
}

const slugToTitle = (slug: string) =>
  slug
    .split('-')
    .map((word) => capitalize(word))
    .join(' ')

const capitalize = (word: string, length = 2) =>
  word === 'eda' || word.length <= length
    ? word.toUpperCase()
    : word.replace(/^\w/, (c) => c.toUpperCase())
