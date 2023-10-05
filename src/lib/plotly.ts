import type { ColorTokens } from '@fluentui/react-components'

import { transpose, range } from './array'
import { just, list } from './utils'

type ColorToken = Property<ColorTokens>
type Rgb = readonly [number, number, number]

export const tokenToHex = (token: ColorToken) =>
  getComputedStyle(document.body).getPropertyValue(
    token.substring(4, token.length - 1),
  )

const parseHex = (hexString: string) => parseInt(hexString, 16)

const splitHexString = (hexString: string) =>
  list([1, 3, 5] as const)((x) => hexString.substring(x, x + 2))()

const hexToRgb = (hexString: string) =>
  just(hexString)(splitHexString).convert(list)(parseHex)() as Rgb

const numToHex = (x: number) => x.toString(16).padStart(2, '0')

const interpolate =
  (time: number) =>
  ([start, end]: readonly [number, number]) =>
    Math.round(start + time * (end - start))

const divideBy = (n: number) => (x: number) => x / n

const timeToColorStep = (rgbDiffs: Transpose<[Rgb, Rgb]>) => (t: number) => [
  t,
  list(rgbDiffs)(interpolate(t))(numToHex).convert(just)((x) => x.join(''))(),
]

export const fluentColorScale = (
  color1Token: ColorToken,
  color2Token: ColorToken,
  n: number,
) => {
  const rgbDiffs = list([color1Token, color2Token] as const)(tokenToHex)(
    hexToRgb,
  )
    .convert(just)((x) => x as [Rgb, Rgb])(transpose)
    .convert(list)()

  return list(range(n))(divideBy(n - 1))(
    timeToColorStep(rgbDiffs),
  )() as Plotly.ColorScale
}
