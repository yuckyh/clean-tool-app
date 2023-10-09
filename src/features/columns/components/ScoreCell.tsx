import { makeStyles, tokens } from '@fluentui/react-components'
import { fluentColorScale } from '@/lib/plotly'
import { useAppSelector } from '@/lib/hooks'
import Plot from '@/components/Plot'
import { useMemo } from 'react'

import { getScore } from '../selectors'

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

  const score = useAppSelector((state) => getScore(state, pos))

  const colorscale = useMemo(
    () =>
      fluentColorScale(
        tokens.colorStatusDangerForegroundInverted,
        tokens.colorStatusSuccessForegroundInverted,
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
