// sourcery skip: avoid-function-declarations-in-blocks
export const getPersisted = <T extends string, K extends string>(
  key: K,
  defaultValue: T,
): T => {
  return (localStorage.getItem(key) ?? defaultValue) as T
}

export const setPersisted = <T extends string, K extends string>(
  key: K,
  value: T,
) => {
  localStorage.setItem(key, value)
}
