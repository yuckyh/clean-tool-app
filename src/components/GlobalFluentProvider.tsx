import {
  FluentProviderProps,
  FluentProviderSlots,
  FluentProviderState,
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

const GlobalFluentProvider = ({
  children,
  theme,
  ...props
}: FluentProviderProps) => {
  const preference = useThemePreference()
  theme = preference ? webDarkTheme : webLightTheme

  const classes = useFluentStyledState<
    FluentProviderSlots,
    FluentProviderProps,
    FluentProviderState,
    HTMLDivElement
  >(
    { theme, children, ...props },
    useFluentProviderStyles_unstable,
    useFluentProvider_unstable,
  ).root!.className!

  useBodyClasses(classes)

  return children
}

export default GlobalFluentProvider
