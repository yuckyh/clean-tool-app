import type { ColorScale } from 'plotly.js-cartesian-dist-min'
import type { ColorTokens } from '@fluentui/react-components'

import { identity, flow, pipe } from 'fp-ts/function'
import * as RA from 'fp-ts/ReadonlyArray'
import * as S from 'fp-ts/string'
import { divideBy } from './number'
import { useTokenToHex } from './hooks'

type ColorToken = Property<ColorTokens>
type Rgb = readonly [number, number, number]
type Diff = readonly [number, number]
type TransposedRgbDiff = readonly [Diff, Diff, Diff]

const splitHexString = (hexString: string) =>
  pipe(
    [1, 3, 5] as const,
    RA.map((x) => S.slice(x, x + 2)),
    RA.flap(hexString),
  ) as readonly [string, string, string]

const hexToRgb = (hexString: string) =>
  pipe(
    hexString,
    splitHexString,
    RA.map((hex) => parseInt(hex, 16)),
  ) as Rgb

const numToHex = (x: number) => x.toString(16).padStart(2, '0')

const interpolate =
  ([start, end]: Diff) =>
  (time: number) =>
    Math.round(start + time * (end - start))

const timeToColorStep = (t: number) => (rgbDiffs: TransposedRgbDiff) => [
  t,
  pipe(rgbDiffs, RA.map(interpolate), RA.flap(t), RA.map(numToHex)).join(''),
]

// eslint-disable-next-line import/prefer-default-export
export const useFluentColorScale = (
  color1Token: ColorToken,
  color2Token: ColorToken,
  n: number,
) => {
  const rgbDiffs = pipe(
    [color1Token, color2Token] as const,
    RA.map(flow(useTokenToHex, hexToRgb)),
    ([rgb1, rgb2]) => RA.zip(rgb1 ?? [])(rgb2 ?? []),
  ) as TransposedRgbDiff

  return pipe(
    RA.makeBy(n, identity),
    RA.map(divideBy),
    RA.flap(n - 1),
    RA.map(timeToColorStep),
    RA.flap(rgbDiffs),
  ) as ColorScale
}
