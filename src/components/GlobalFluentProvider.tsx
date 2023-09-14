import type {
  FluentProviderProps,
  FluentProviderSlots,
  FluentProviderState,
} from '@fluentui/react-components'
import {
  useFluentProviderStyles_unstable,
  useFluentProvider_unstable,
  webDarkTheme,
  webLightTheme,
} from '@fluentui/react-components'

import { useFluentStyledState } from '@/hooks'
import { useEffect, useMemo, useSyncExternalStore } from 'react'

const useThemePreference = () => {
  const themeMedia = useMemo(
    () => matchMedia('(prefers-color-scheme: dark)'),
    [],
  )

  return useSyncExternalStore(
    (cb) => {
      themeMedia.addEventListener('change', cb)
      return () => {
        themeMedia.removeEventListener('change', cb)
      }
    },
    () => themeMedia.matches,
  )
}

const useBodyClasses = (classes: string) => {
  useEffect(() => {
    const classList = classes.split(' ')
    document.body.classList.add(...classList)

    return () => {
      document.body.classList.remove(...classList)
    }
  }, [classes])

  return classes
}

const GlobalFluentProvider = ({ children, ...props }: FluentProviderProps) => {
  const theme = useThemePreference() ? webDarkTheme : webLightTheme

  const classes = useFluentStyledState<
    FluentProviderProps,
    FluentProviderState,
    FluentProviderSlots
  >(
    { theme, children, ...props },
    useFluentProviderStyles_unstable,
    useFluentProvider_unstable,
  ).root.className

  useBodyClasses(classes ?? '')

  return children
}

export default GlobalFluentProvider
