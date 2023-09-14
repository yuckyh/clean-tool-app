import { Outlet, useNavigation } from 'react-router-dom'
import ProgressNav from '@/components/ProgressNav'
import {
  Spinner,
  Subtitle1,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import { useMemo } from 'react'
import Loader from '@/components/Loader'

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

const Layout = () => {
  const classes = useClasses()
  const navigation = useNavigation()
  const loading = useMemo(
    () => navigation.state === 'loading',
    [navigation.state],
  )

  return (
    <>
      <header className={classes.header}>
        <ProgressNav thickness="large" />
      </header>
      <main className={classes.main}>
        <Loader
          size="huge"
          labelPosition="below"
          label={<Subtitle1>Loading...</Subtitle1>}>
          {loading ? (
            <Spinner
              labelPosition="below"
              size="huge"
              label={<Subtitle1>Loading...</Subtitle1>}
            />
          ) : (
            <Outlet />
          )}
        </Loader>
      </main>
    </>
  )
}

export default Layout
