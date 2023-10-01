import Plot from '@/components/Plot'
import fuse from '@/lib/fuse'
import { useAppSelector } from '@/lib/hooks'
import { just } from '@/lib/utils'
import { makeStyles } from '@fluentui/react-components'

import type { ColumnNameData } from '../../features/columnsSlice'

const useClasses = makeStyles({
  plot: {
    height: '44px',
    maxHeight: '44px',
    width: '80%',
  },
})

interface Props {
  colorscale?: Plotly.ColorScale
  config: Partial<Plotly.Config>
  item: ColumnNameData
  layout: Partial<Plotly.Layout>
}

const ScoreCell = ({
  colorscale,
  config,
  item: { index, pos, scores },
  layout,
}: Props) => {
  const classes = useClasses()

  const { matchColumns } = useAppSelector(({ columns }) => columns)
  const column = matchColumns[pos] ?? ''

  const score = just(column)(fuse.search.bind(fuse))(([match]) => match?.score)(
    (score) => (index < 0 ? score : scores[index]),
  )((score) => score ?? 1)()

  const formattedScore = (1 - score).toFixed(2)

  const data: Plotly.Data[] = [
    {
      hovertemplate: 'score: %{x}',
      marker: {
        cmax: 1,
        cmin: 0,
        color: [score],
        colorscale: colorscale,
      },
      name: '',
      type: 'bar',
      x: [formattedScore],
    },
  ]
  return (
    <>
      <Plot
        className={classes.plot}
        config={config}
        data={data}
        layout={layout}
      />
      {formattedScore}
    </>
  )
}

export default ScoreCell
