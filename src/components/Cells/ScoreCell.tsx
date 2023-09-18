import codebook from '@/../data/codebook.json'
import { type ColumnNameData, useAppSelector } from '@/hooks'
import { fluentColorScale } from '@/lib/plotly'
import { makeStyles, tokens } from '@fluentui/react-components'
import Fuse from 'fuse.js'

import Plot from '../Plot'

const useClasses = makeStyles({
  plot: {
    height: '44px',
    maxHeight: '44px',
    width: '80%',
  },
})

interface Props {
  item: ColumnNameData
}

const ScoreCell = ({ item }: Props) => {
  const { matches, position } = item
  const classes = useClasses()

  const { columns } = useAppSelector(({ columns }) => columns)

  const index = matches.findIndex(
    (match) => match.item.name === columns[position],
  )
  const score =
    1 -
    ((index < 0
      ? new Fuse(codebook, {
          includeScore: true,
          keys: ['name'],
          threshold: 1,
        }).search(columns[position] ?? '')[0]?.score
      : matches[index]?.score) ?? 1)
  const formattedScore = score.toFixed(2)
  const data: Plotly.Data[] = [
    {
      hovertemplate: 'score: %{x}',
      marker: {
        cmax: 1,
        cmin: 0,
        color: [score],
        colorscale: fluentColorScale(
          tokens.colorStatusDangerForegroundInverted,
          tokens.colorStatusSuccessForegroundInverted,
          64,
        ),
      },
      name: '',
      type: 'bar',
      x: [formattedScore],
    },
  ]

  const layout: Partial<Plotly.Layout> = {
    autosize: true,

    clickmode: 'none',
    dragmode: false,
    margin: {
      b: 0,
      l: 0,
      r: 0,
      t: 0,
    },
    xaxis: {
      fixedrange: true,
      nticks: 0,
      range: [0, 1],
      showgrid: false,
      showticklabels: false,
      ticks: '',
      zeroline: false,
    },
    yaxis: {
      fixedrange: true,
      nticks: 0,
      showticklabels: false,
      ticks: '',
    },
  }

  const config: Partial<Plotly.Config> = {
    scrollZoom: false,
  }
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
