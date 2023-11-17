/**
 * @file This file contains the score cell component for the matches data grid.
 * @module components/ColumnMatching/ScoreCell
 */

import Plot from '@/components/Plot'
import { useAppSelector } from '@/lib/hooks'
import { useFluentColorScale } from '@/lib/plotly'
import { makeStyles, shorthands, tokens } from '@fluentui/react-components'

import { selectScore } from './selectors'

const useClasses = makeStyles({
  plot: {
    flexGrow: 1,
    height: '44px',
    maxHeight: '44px',
    width: '80%',
  },
  root: {
    alignItems: 'center',
    display: 'flex',
    width: '100%',
    ...shorthands.padding(0, tokens.spacingHorizontalS),
    columnGap: tokens.spacingHorizontalXS,
    justifyContent: 'center',
  },
})

/**
 * The props for {@link ScoreCell}.
 */
export interface Props {
  /**
   *
   */
  pos: number
}

/**
 * This function renders the score cell that contains a score bar.
 * @param props - The {@link Props props} for the component.
 * @returns The component object.
 * @example
 * ```tsx
 *  <ScoreCell pos={pos} />
 * ```
 */
export default function ScoreCell(props: Readonly<Props>) {
  const classes = useClasses()

  const score = useAppSelector(selectScore(props))

  const colorscale = useFluentColorScale(
    tokens.colorStatusDangerForegroundInverted,
    tokens.colorStatusSuccessForegroundInverted,
    16,
  )

  return (
    <div className={classes.root}>
      <Plot
        className={classes.plot}
        config={{
          displayModeBar: false,
          scrollZoom: false,
        }}
        data={[
          {
            hovertemplate: 'score: %{x}',
            marker: {
              cmax: 1,
              cmin: 0,
              color: [score],
              colorscale,
            },
            name: '',
            type: 'bar',
            x: [score],
          },
        ]}
        layout={{
          autosize: true,

          clickmode: 'none',
          datarevision: score,
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
        }}
      />
      {score}
    </div>
  )
}
