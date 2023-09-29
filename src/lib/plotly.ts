import type { ColorTokens } from '@fluentui/react-components'

import { transpose } from './array'
import { curry, just, list } from './utils'

type ColorToken = Property<ColorTokens>

export const tokenToHex = (token: ColorToken) =>
  getComputedStyle(document.body).getPropertyValue(
    token.substring(4, token.length - 1),
  )

const parseHex = (hexString: string) => parseInt(hexString, 16)

const hexToRgb = (hexColor: string) =>
  list([1, 3, 5] as const)((x) => hexColor.substring(x, x + 2))(parseHex)()

const rgbToHex = (rgb: number[] | readonly number[]) =>
  '#' + rgb.map((c) => c.toString(16).padStart(2, '0')).join('')

const interpolate = (time: number, [start, end]: [number, number]) =>
  start + time * (end - start)

const tokensToInterpolatedHex = (tokens: readonly ColorToken[], t: number) =>
  list(tokens)(tokenToHex)(hexToRgb)
    .convert(just)(transpose)
    .convert(list)((x) => x as [number, number])(curry(interpolate)(t))(
      Math.round,
    )
    .convert(just)(rgbToHex)()

const divideBy = (n: number) => (x: number) => x / n

export const fluentColorScale = (
  color1Token: ColorToken,
  color2Token: ColorToken,
  n: number,
) =>
  just(n)(Array)(Array.from).convert(list)((_, i) => i)(divideBy(n - 1))(
    (t) => [t, tokensToInterpolatedHex([color1Token, color2Token], t)],
  )() as Plotly.ColorScale
