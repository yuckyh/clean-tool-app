import type { ColumnNameData } from '@/hooks'
import { columnStateStore } from '@/lib/StateStore/column'
import { fluentColorScale } from '@/lib/plotly'
import { makeStyles, tokens } from '@fluentui/react-components'
import { useSyncExternalStore } from 'react'
import Plot from '../Plot'
import Fuse from 'fuse.js'
import codebook from '@/../data/codebook.json'

const useClasses = makeStyles({
  plot: {
    maxHeight: '44px',
    width: '80%',
    height: '44px',
  },
})

interface Props {
  item: ColumnNameData
}

const ScoreCell = ({ item }: Props) => {
  const { matches, position } = item
  const classes = useClasses()

  const selectedColumns = Array.from(
    useSyncExternalStore(
      columnStateStore.subscribe,
      () => columnStateStore.columns,
    ),
  )

  const index = matches.findIndex(
    (match) => match.item.name === selectedColumns[position],
  )
  const score =
    1 -
    ((index < 0
      ? new Fuse(codebook, {
          threshold: 1,
          includeScore: true,
          keys: ['name'],
        }).search(selectedColumns[position] ?? '')[0]?.score
      : matches[index]?.score) ?? 1)
  const formattedScore = score.toFixed(2)
  const data: Plotly.Data[] = [
    {
      name: '',
      x: [formattedScore],
      type: 'bar',
      hovertemplate: 'score: %{x}',
      marker: {
        cmin: 0,
        cmax: 1,
        color: [score],
        colorscale: fluentColorScale(
          tokens.colorStatusDangerForegroundInverted,
          tokens.colorStatusSuccessForegroundInverted,
          64,
        ),
      },
    },
  ]

  const layout: Partial<Plotly.Layout> = {
    autosize: true,

    margin: {
      t: 0,
      l: 0,
      b: 0,
      r: 0,
    },
    xaxis: {
      range: [0, 1],
      zeroline: false,
      showgrid: false,
      showticklabels: false,
      fixedrange: true,
      nticks: 0,
      ticks: '',
    },
    yaxis: {
      fixedrange: true,
      nticks: 0,
      ticks: '',
      showticklabels: false,
    },
    dragmode: false,
    clickmode: 'none',
  }

  const config: Partial<Plotly.Config> = {
    scrollZoom: false,
  }
  return (
    <>
      <Plot
        className={classes.plot}
        data={data}
        layout={layout}
        config={config}
      />
      {formattedScore}
    </>
  )
}

export default ScoreCell
