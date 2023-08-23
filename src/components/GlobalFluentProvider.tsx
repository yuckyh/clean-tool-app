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

import {
  useBodyClasses,
  useFluentStyledState,
  useThemePreference,
} from '@/hooks'

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
