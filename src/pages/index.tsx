/* eslint-disable import/prefer-default-export */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/immutable-data */
import {
  CardFooter,
  CardHeader,
  makeStyles,
  shorthands,
  Button,
  Title1,
  tokens,
  Card,
} from '@fluentui/react-components'
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

// TODO: make download work

export function Component() {
  const classes = useClasses()

  const uploadHref = useHref('/upload')

  const handleClick = useLinkClickHandler('/upload')

  return (
    <section className={classes.root}>
      <Card className={classes.card} size="large">
        <CardHeader header={<Title1>CLEaN Tool</Title1>} />
        <CardFooter
          action={
            <Button
              onClick={handleClick}
              appearance="primary"
              href={uploadHref}
              as="a">
              Upload
            </Button>
          }
        />
      </Card>
    </section>
  )
}

Component.displayName = 'Home'
