export const pascalToTitle = (pascalString: string) => {
  const titleString = pascalString.replace(/([a-z])([A-Z])/g, '$1 $2')
  return titleString.charAt(0).toUpperCase() + titleString.slice(1)
}

export const getPathTitle = (path: string) => {
  return path === '/'
    ? 'Home'
    : (path.split('/').pop() ?? '')
        .replace(/-/g, ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}
