import type { PropsWithChildren } from 'react'

import {
  useThemeClassName,
  makeStyles,
  shorthands,
  Subtitle1,
  Spinner,
  tokens,
} from '@fluentui/react-components'
import ProgressNav from '@/features/progress/components/ProgressNav'
import { useNavigation } from 'react-router-dom'
import { useEffect, useMemo } from 'react'
import Loader from '@/components/Loader'

const useClasses = makeStyles({
  main: {
    flexDirection: 'column',
    display: 'flex',
    ...shorthands.padding(tokens.spacingVerticalXXXL),
  },
  header: {
    ...shorthands.padding(tokens.spacingVerticalXXL),
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
