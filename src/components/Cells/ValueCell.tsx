import { getColumn, getData } from '@/features/sheet/selectors'
import { useAppSelector } from '@/lib/hooks'

interface Props {
  col: number
  row: number
}

const ValueCell = ({ row, col }: Props) => {
  const column = useAppSelector((state) => getColumn(state, true, col))

  return useAppSelector((state) => getData(state)[row]?.[column])
}

export default ValueCell
