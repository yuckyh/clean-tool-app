import { useAppSelector } from '@/lib/hooks'

import { getColumn } from '../selectors'

interface Props {
  col: number
  row: number
}

const PreviewValueCell = ({ row, col }: Props) => {
  const column = useAppSelector((state) => getColumn(state, col))

  return useAppSelector(({ sheet }) => sheet.data[row]?.[column])
}

export default PreviewValueCell
