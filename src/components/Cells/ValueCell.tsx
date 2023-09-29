interface Props {
  item: CellItem
  original: string
}

const ValueCell = ({ item, original }: Props) => <>{item[original]}</>

export default ValueCell
