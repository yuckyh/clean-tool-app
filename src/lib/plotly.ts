import type { ColorTokens } from '@fluentui/react-components'
import type { ColorScale } from 'plotly.js-cartesian-dist'

import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'
import * as S from 'fp-ts/string'

import { divideBy } from './fp/number'
import { useTokenToHex } from './hooks'

type ColorToken = Property<ColorTokens>
type Rgb = readonly [number, number, number]
type Diff = readonly [number, number]
type TransposedRgbDiff = readonly [Diff, Diff, Diff]

const splitHexString = (hexString: string) =>
  f.pipe(
    [1, 3, 5] as const,
    RA.map(f.flow((x) => S.slice(x, x + 2), f.apply(hexString))),
  ) as readonly [string, string, string]

const hexToRgb = (hexString: string) =>
  f.pipe(
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
  f.pipe(rgbDiffs, RA.map(f.flow(interpolate, f.apply(t), numToHex))).join(''),
]

// eslint-disable-next-line import/prefer-default-export
export const useFluentColorScale = (
  color1Token: ColorToken,
  color2Token: ColorToken,
  n: number,
) => {
  const rgbDiffs = f.pipe(
    [color1Token, color2Token] as const,
    RA.map(f.flow(useTokenToHex, hexToRgb)),
    (rgbs) => RA.zip(...(rgbs as [Rgb, Rgb])),
  ) as TransposedRgbDiff

  return f.pipe(
    RA.makeBy(
      n,
      f.flow(divideBy, f.apply(n - 1), timeToColorStep, f.apply(rgbDiffs)),
    ),
  ) as ColorScale
}
