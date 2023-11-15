import { makeStyles, shorthands, tokens } from '@fluentui/react-components'

const useClasses = makeStyles({
  root: {
    ...shorthands.padding(0, tokens.spacingHorizontalS),
    display: 'flex',
    fontWeight: 'bold',
    justifyContent: 'center',
    width: '100%',
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
}

/**
 * This function renders the header cell of the for the download preview data grid.
 * @param props - The {@link Props props} of the component.
 * @param props.header - The header to display
 * @returns The component object.
 * @example
 * ```tsx
 *  <HeaderCell header={header} />
 * ```
 */
export default function HeaderCell({ header }: Readonly<Props>) {
  const classes = useClasses()

  return <div className={classes.root}>{header}</div>
}
