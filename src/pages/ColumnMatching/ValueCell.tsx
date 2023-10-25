import { getColumn } from '@/features/sheet/selectors'
import { useAppSelector } from '@/lib/hooks'
import { makeStyles, shorthands, tokens } from '@fluentui/react-components'

interface Props {
  pos: number
}

const useClasses = makeStyles({
  root: {
    ...shorthands.padding(0, tokens.spacingHorizontalS),
  },
})

export default function ValueCell({ pos }: Props) {
  const classes = useClasses()

  const cell = useAppSelector((state) => getColumn(state, pos))

  return <div className={classes.root}>{cell}</div>
}
