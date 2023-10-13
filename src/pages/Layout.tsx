import {
  makeStyles,
  shorthands,
  Subtitle1,
  Spinner,
  tokens,
} from '@fluentui/react-components'
import { useNavigation, Outlet } from 'react-router-dom'
import { useMemo } from 'react'
import ProgressNav from '@/features/progress/components/ProgressNav'
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

export default function Layout() {
  const classes = useClasses()

  const navigation = useNavigation()

  const loading = useMemo(
    () => navigation.state === 'loading',
    [navigation.state],
  )

  return (
    <div>
      <header className={classes.header}>
        <ProgressNav />
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
            <Outlet />
          )}
        </Loader>
      </main>
    </div>
  )
}
