import type { PropsWithChildren } from 'react'

import Loader from '@/components/Loader'
import ProgressNav from '@/components/ProgressNav'
import {
  Spinner,
  Subtitle1,
  makeStyles,
  shorthands,
  tokens,
  useThemeClassName,
} from '@fluentui/react-components'
import { useEffect, useMemo } from 'react'
import { useNavigation } from 'react-router-dom'

const useClasses = makeStyles({
  header: {
    ...shorthands.padding(tokens.spacingVerticalXXL),
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.padding(tokens.spacingVerticalXXXL),
  },
})

const Layout = ({ children }: PropsWithChildren) => {
  const classes = useClasses()
  const navigation = useNavigation()
  const loading = useMemo(
    () => navigation.state === 'loading',
    [navigation.state],
  )

  const themeClasses = useThemeClassName()

  useEffect(() => {
    const classList = themeClasses.split(' ')
    document.body.classList.add(...classList)

    return () => {
      document.body.classList.remove(...classList)
    }
  })

  return (
    <>
      <header className={classes.header}>
        <ProgressNav thickness="large" />
      </header>
      <main className={classes.main}>
        <Loader
          label={<Subtitle1>Loading...</Subtitle1>}
          labelPosition="below"
          size="huge">
          {loading ? (
            <Spinner
              label={<Subtitle1>Loading...</Subtitle1>}
              labelPosition="below"
              size="huge"
            />
          ) : (
            children
          )}
        </Loader>
      </main>
    </>
  )
}

export default Layout
