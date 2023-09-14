import type Plotly from 'plotly.js-cartesian-dist'
import { type ColorTokens } from '@fluentui/react-components'

type ColorToken = ColorTokens[keyof ColorTokens]

export const tokenToColor = (token: ColorToken) =>
  getComputedStyle(document.body).getPropertyValue(
    token.substring(4, token.length - 1),
  )

const hexToRgb = (hexColor: string): number[] => {
  return [
    parseInt(hexColor.slice(1, 3), 16),
    parseInt(hexColor.slice(3, 5), 16),
    parseInt(hexColor.slice(5, 7), 16),
  ]
}
const rgbToHex = (rgbColor: number[]): string => {
  return '#' + rgbColor.map((c) => c.toString(16).padStart(2, '0')).join('')
}

export const fluentColorScale = (
  color1Token: ColorToken,
  color2Token: ColorToken,
  n: number,
): Plotly.ColorScale =>
  Array.from({ length: n }, (_, i): [number, string] => {
    const t = i / (n - 1)
    const interpolatedRgb = hexToRgb(tokenToColor(color1Token)).map((c1, j) =>
      Math.round(c1 + t * ((hexToRgb(tokenToColor(color2Token))[j] ?? 0) - c1)),
    )
    return [t, rgbToHex(interpolatedRgb)]
  })
