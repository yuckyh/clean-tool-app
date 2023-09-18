export const getPersisted = <T extends string>(
  key: string,
  defaultValue: T,
): T => {
  return (localStorage.getItem(key) ?? defaultValue) as T
}

export const setPersisted = <T extends string>(key: string, value: T) => {
  localStorage.setItem(key, value)
}
