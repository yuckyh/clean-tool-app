import { getColumns } from '@/features/sheet/selectors'
import { useAppSelector } from '@/lib/hooks'

interface Props {
  item: CellItem
  pos: number
}

const ValueCell = ({ item, pos }: Props) => {
  const column = useAppSelector((state) => getColumns(state)[pos] ?? '')

  return <>{item[column]}</>
}

export default ValueCell
