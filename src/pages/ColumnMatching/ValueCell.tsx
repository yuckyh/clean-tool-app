import { useAppSelector } from '@/lib/hooks'
import { getColumn } from '@/selectors/columnsSelectors'
import { makeStyles, shorthands, tokens } from '@fluentui/react-components'

const useClasses = makeStyles({
  root: {
    alignItems: 'center',
    display: 'flex',
    width: '100%',
    ...shorthands.padding(0, tokens.spacingHorizontalS),
  },
})

interface Props {
  pos: number
}

export default function ValueCell({ pos }: Props) {
  const classes = useClasses()

  const cell = useAppSelector((state) => getColumn(state, pos))

  return <div className={classes.root}>{cell}</div>
}
