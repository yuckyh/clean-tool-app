import type { ColorScale } from 'plotly.js-cartesian-dist-min'
import type { ColorTokens } from '@fluentui/react-components'

import { range, zip } from 'lodash'

import { just, list } from './monads'
// import { range } from './array'
import { divideBy } from './number'
import { useTokenToHex } from './hooks'

type ColorToken = Property<ColorTokens>
type Rgb = readonly [number, number, number]

const parseHex = (hexString: string) => parseInt(hexString, 16)

const splitHexString = (hexString: string) =>
  list([1, 3, 5] as const)((x) => hexString.substring(x, x + 2))()

const hexToRgb = (hexString: string) =>
  just(hexString)(splitHexString).convert(list)(parseHex)() as Rgb

const numToHex = (x: number) => x.toString(16).padStart(2, '0')

const interpolate =
  ([start = 0, end = 0]) =>
  (time: number) =>
    Math.round(start + time * (end - start))

const timeToColorStep =
  (t: number) => (rgbDiffs: [undefined | number, undefined | number][]) => [
    t,
    list(rgbDiffs)(interpolate).pass(t)(numToHex)().join(''),
  ]

// eslint-disable-next-line import/prefer-default-export
export const useFluentColorScale = (
  color1Token: ColorToken,
  color2Token: ColorToken,
  n: number,
) => {
  const rgbDiffs = list([color1Token, color2Token] as const)(useTokenToHex)(
    hexToRgb,
  )
    .convert(just)(([x = [], y = []]) => zip<number, number>(x, y))
    .convert(list)()

  return just(n)(range)
    .convert(list)(divideBy)
    .pass(n - 1)(timeToColorStep)
    .pass(rgbDiffs)() as ColorScale
}
