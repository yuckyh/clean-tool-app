/**
 * @file This file contains the utilities for plotly.js
 * @module lib/plotly
 */

/* eslint-disable
  import/prefer-default-export
*/

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
 * The function to split a hex string into three parts.
 * @param hexString - The hex string to split.
 * @returns A tuple with three parts of the hex string.
 * @example
 *  splitHexString('#ff0000') // => ['#ff', '00', '00']
 */
const splitHexString = (hexString: string) =>
  RA.makeBy(
    3,
    f.flow(add(1), (x) => S.slice(x, x + 2)(hexString)),
  ) as readonly [string, string, string]

/**
 * The function to convert a hex string to an rgb tuple.
 * @param hexString - The hex string to convert.
 * @returns An rgb tuple.
 * @example
 *  hexToRgb('#ff0000') // => [255, 0, 0]
 */
const hexToRgb = (hexString: string) =>
  f.pipe(
    hexString,
    splitHexString,
    RA.map((hex) => parseInt(hex, 16)),
  ) as Rgb

/**
 * The function to convert a number to a hex string.
 * @param x - The number to convert.
 * @returns A hex string.
 * @example
 *  numToHex(255) // => 'ff'
 */
const numToHex = (x: number) => x.toString(16).padStart(2, '0')

/**
 * The function to create a linear space between two numbers on a given interval.
 * @param bounds - The bounds of the interval.
 * @param bounds."0" - The lower bound.
 * @param bounds."1" - The upper bound.
 * @returns A function to create a linear space between two numbers on a given interval.
 * @example
 *  interpolate([0, 10])(0.5) // => 5
 */
const interpolate =
  ([start, end]: Diff) =>
  (time: number) =>
    Math.round(start + time * (end - start))

/**
 * The function to convert a time to a color step.
 * @param t - The time to convert.
 * @returns A function to convert a rgb diff to a color step.
 * @example
 *  timeToColorStep(0.5)([[0, 255], [0, 0], [0, 0]]) // => [0.5, '#7f0000']
 */
const timeToColorStep = (t: number) => (rgbDiffs: TransposedRgbDiff) => [
  t,
  RA.map(f.flow(interpolate, f.apply(t), numToHex))(rgbDiffs).join(''),
]

/**
 * The function to create a color scale from two color tokens.
 * @param color1Token - The first color token.
 * @param color2Token - The second color token.
 * @param n - The number of steps in the color scale.
 * @returns A color scale.
 * @example
 *  useFluentColorScale('neutralPrimary', 'neutralPrimary', 3) // => [[0, '#000000'], [0.5, '#7f7f7f'], [1, '#ffffff']]
 */
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
