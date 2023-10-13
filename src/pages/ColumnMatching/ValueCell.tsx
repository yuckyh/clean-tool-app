import { getColumn } from '@/features/sheet/selectors'
import { useAppSelector } from '@/lib/hooks'

interface Props {
  pos: number
}

export default function ValueCell({ pos }: Props) {
  const column = useAppSelector((state) => getColumn(state, pos))

  return <div>{column}</div>
}
