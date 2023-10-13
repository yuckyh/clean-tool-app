import type { DependencyList } from 'react'
import { useEffect } from 'react'

export const logger = <T, K extends AnyArray>(
  obj: Record<string, T>,
  ...args: K
) => {
  const [name, value] = Object.entries(obj)[0] ?? ['']
  console.log(name, value, ...args)
  return value as T
}

export const useLoggerEffect = (
  dep: Record<string, ArrayElement<DependencyList>>,
  ...args: [...unknown[]]
) => {
  useEffect(() => {
    console.trace(...(Object.entries(dep)[0] ?? ['']), ...args)
  }, [dep, args])
}
