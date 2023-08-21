export const pascalToTitle = (pascalString: string) => {
  const titleString = pascalString.replace(/([a-z])([A-Z])/g, '$1 $2')
  return titleString.charAt(0).toUpperCase() + titleString.slice(1)
}
