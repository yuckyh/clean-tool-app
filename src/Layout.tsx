import { Outlet, useNavigation } from 'react-router-dom'
import ProgressNav from '@/components/ProgressNav'
import {
  Spinner,
  Subtitle1,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import { useEffect, useState } from 'react'

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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (navigation.state === 'loading') {
      setLoading(true)
      return
    }
    setLoading(false)
  }, [navigation.state])
  console.log(navigation.state)

  return (
    <>
      <header className={classes.header}>
        <ProgressNav thickness="large" />
      </header>
      <main className={classes.main}>
        {loading ? (
          <Spinner
            size="huge"
            labelPosition="below"
            label={<Subtitle1>Loading...</Subtitle1>}
          />
        ) : (
          <Outlet />
        )}
      </main>
    </>
  )
}

export default Layout
