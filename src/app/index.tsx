/* eslint-disable functional/functional-parameters */
import { author, description, keywords } from '@/../package.json'
import store from '@/app/store'
import { useGlobalStyles, useStorage, useThemePreference } from '@/lib/hooks'
import { FluentProvider } from '@fluentui/react-components'
import { console } from 'fp-ts'
import { constant } from 'fp-ts/function'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { useRegisterSW } from 'virtual:pwa-register/react'

export default function App() {
  useGlobalStyles()
  useStorage()
  useRegisterSW({
    immediate: true,
    onOfflineReady: constant(console.log('offline ready')),
  })

  return (
    <Provider store={store}>
      <FluentProvider theme={useThemePreference()}>
        <HelmetProvider>
          <Helmet
            defaultTitle="CLEaN Tool"
            prioritizeSeoTags
            titleTemplate="%s - CLEaN Tool">
            <meta content={author.name} name="author" />
            <meta content={description} name="description" />
            <meta content={keywords.join(',')} name="keywords" />
          </Helmet>
          <Outlet />
        </HelmetProvider>
      </FluentProvider>
    </Provider>
  )
}
