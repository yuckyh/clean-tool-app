import fuse from '@/lib/fuse'
import { type ColumnNameData, useAppSelector } from '@/lib/hooks'
import { fluentColorScale } from '@/lib/plotly'
import { makeStyles, tokens } from '@fluentui/react-components'

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

const ScoreCell = ({ item: { matches, position } }: Props) => {
  const classes = useClasses()

  const { columns } = useAppSelector(({ columns }) => columns)

  const matchIndex = matches.findIndex(
    (match) => match.item.name === columns[position],
  )
  const score =
    1 -
    ((matchIndex < 0
      ? fuse.search(columns[position] ?? '')[0]?.score
      : matches[matchIndex]?.score) ?? 1)
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
