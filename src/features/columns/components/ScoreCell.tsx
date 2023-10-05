import { makeStyles, tokens } from '@fluentui/react-components'
import { useAppSelector, useEffectLog } from '@/lib/hooks'
import { fluentColorScale } from '@/lib/plotly'
import Plot from '@/components/Plot'
import { useMemo } from 'react'
import fuse from '@/lib/fuse'

import { getMatchColumn, getMatchIndex } from '../selectors'

const useClasses = makeStyles({
  plot: {
    maxHeight: '44px',
    height: '44px',
    width: '80%',
  },
})

interface Props {
  pos: number
}

const ScoreCell = ({ pos }: Props) => {
  const classes = useClasses()

  const matchColumn = useAppSelector((state) => getMatchColumn(state, pos))
  const matchIndex = useAppSelector((state) => getMatchIndex(state, pos))

  const score = useMemo(
    () =>
      (
        1 - (matchIndex?.score ?? fuse.search(matchColumn)[0]?.score ?? 1)
      ).toFixed(2),
    [matchColumn, matchIndex],
  )

  const colorscale = useMemo(
    () =>
      fluentColorScale(
        tokens.colorStatusDangerForeground3,
        tokens.colorStatusSuccessForeground3,
        64,
      ),
    [],
  )

  return (
    <>
      <Plot
        layout={{
          xaxis: {
            showticklabels: false,
            fixedrange: true,
            showgrid: false,
            zeroline: false,
            range: [0, 1],
            nticks: 0,
            ticks: '',
          },

          yaxis: {
            showticklabels: false,
            fixedrange: true,
            nticks: 0,
            ticks: '',
          },
          margin: {
            b: 0,
            l: 0,
            r: 0,
            t: 0,
          },
          datarevision: score,

          clickmode: 'none',
          dragmode: false,
          autosize: true,
        }}
        data={[
          {
            marker: {
              color: [score],
              colorscale,
              cmax: 1,
              cmin: 0,
            },
            hovertemplate: 'score: %{x}',
            type: 'bar',
            x: [score],
            name: '',
          },
        ]}
        config={{
          displayModeBar: false,
          scrollZoom: false,
        }}
        className={classes.plot}
      />
      {score}
    </>
  )
}

export default ScoreCell
