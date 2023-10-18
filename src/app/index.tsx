/* eslint-disable functional/functional-parameters */
import { FluentProvider } from '@fluentui/react-components'
import { HelmetProvider, Helmet } from 'react-helmet-async'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { Outlet } from 'react-router-dom'
import { Provider } from 'react-redux'
import { description, keywords, author } from '@/../package.json'
import store from '@/app/store'
import { useThemePreference, useGlobalStyles, useStorage } from '@/lib/hooks'
import { console } from 'fp-ts'
import { constant } from 'fp-ts/function'

export default function App() {
  useGlobalStyles()
  useStorage()
  useRegisterSW({
    onOfflineReady: constant(console.log('offline ready')),
    immediate: true,
  })

  return (
    <Provider store={store}>
      <FluentProvider theme={useThemePreference()}>
        <HelmetProvider>
          <Helmet
            titleTemplate="%s - CLEaN Tool"
            defaultTitle="CLEaN Tool"
            prioritizeSeoTags>
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
