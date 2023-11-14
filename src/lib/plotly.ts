import type { ColorTokens } from '@fluentui/react-components'
import type { ColorScale } from 'plotly.js-cartesian-dist'

import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'
import * as S from 'fp-ts/string'

import { add, divideBy } from './fp/number'
import { useTokenToHex } from './hooks'

type ColorToken = Property<ColorTokens>
type Rgb = readonly [number, number, number]
type Diff = readonly [number, number]
type TransposedRgbDiff = readonly [Diff, Diff, Diff]

/**
 *
 * @param hexString
 * @returns
 * @example
 */
const splitHexString = (hexString: string) =>
  RA.makeBy(
    3,
    f.flow(add(1), (x) => S.slice(x, x + 2)(hexString)),
  ) as readonly [string, string, string]

/**
 *
 * @param hexString
 * @returns
 * @example
 */
const hexToRgb = (hexString: string) =>
  f.pipe(
    hexString,
    splitHexString,
    RA.map((hex) => parseInt(hex, 16)),
  ) as Rgb

/**
 *
 * @param x
 * @returns
 * @example
 */
const numToHex = (x: number) => x.toString(16).padStart(2, '0')

/**
 *
 * @param root0
 * @param root0."0"
 * @param root0."1"
 * @example
 */
const interpolate =
  ([start, end]: Diff) =>
  (time: number) =>
    Math.round(start + time * (end - start))

/**
 *
 * @param t
 * @returns
 * @example
 */
const timeToColorStep = (t: number) => (rgbDiffs: TransposedRgbDiff) => [
  t,
  RA.map(f.flow(interpolate, f.apply(t), numToHex))(rgbDiffs).join(''),
]

/**
 *
 * @param color1Token
 * @param color2Token
 * @param n
 * @returns
 * @example
 */
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

  return RA.makeBy(
    n,
    f.flow(divideBy, f.apply(n - 1), timeToColorStep, f.apply(rgbDiffs)),
  ) as ColorScale
}
