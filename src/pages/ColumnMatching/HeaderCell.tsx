import {
  Caption1,
  Subtitle1,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'

const useClasses = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.padding(0, tokens.spacingHorizontalS),
    justifyContent: 'center',
  },
})

/**
 *
 */
interface Props {
  /**
   *
   */
  header: string
  /**
   *
   */
  subtitle: string
}

/**
 *
 * @param props
 * @param props.header
 * @param props.subtitle
 * @returns
 * @example
 */
export default function HeaderCell({ header, subtitle }: Readonly<Props>) {
  const classes = useClasses()

  return (
    <div className={classes.root}>
      <Subtitle1>{header}</Subtitle1>
      <Caption1>{subtitle}</Caption1>
    </div>
  )
}
