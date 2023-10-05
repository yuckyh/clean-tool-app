import {
  CardFooter,
  CardHeader,
  Button,
  Title1,
  tokens,
  Card,
} from '@fluentui/react-components'
import { makeStyles, shorthands } from '@fluentui/react-components'
import { useLinkClickHandler, useHref } from 'react-router-dom'

const useClasses = makeStyles({
  root: {
    flexDirection: 'column',
    display: 'flex',
    width: '40%',
    ...shorthands.margin(0, 'auto'),
  },
  card: {
    ...shorthands.padding(tokens.spacingHorizontalXXXL, '20%'),
  },
})

// TODO: add download button
// TODO: make download work

export const Component = () => {
  const classes = useClasses()

  const uploadHref = useHref('/upload')

  const handleClick = useLinkClickHandler(uploadHref)

  return (
    <section className={classes.root}>
      <Card className={classes.card} size="large">
        <CardHeader header={<Title1>CLEaN Tool</Title1>}></CardHeader>
        <CardFooter
          action={
            <Button
              onClick={handleClick}
              appearance="primary"
              href={uploadHref}
              as="a">
              Upload
            </Button>
          }></CardFooter>
      </Card>
    </section>
  )
}

Component.displayName = 'Home'
