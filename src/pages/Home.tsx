import { Body1, Button, Card, Title1 } from '@fluentui/react-components'
import {
  makeStyles,
  webDarkTheme,
  shorthands,
} from '@fluentui/react-components'
import { useHref } from 'react-router-dom'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.padding(webDarkTheme.spacingVerticalXXXL),
  },
  homeCard: {
    width: 'fit-content',
    ...shorthands.margin(0, 'auto'),
  },
})

const Home = () => {
  const { root, homeCard } = useStyles()
  const edaHref = useHref('/eda')

  return (
    <section className={root}>
      <Title1>Home</Title1>
      <Body1>Welcome</Body1>
      <Card className={homeCard}>
        <Button as="a" href={edaHref} appearance="primary">
          Upload
        </Button>
        <Button>Continue (WIP)</Button>
      </Card>
    </section>
  )
}

export default Home
