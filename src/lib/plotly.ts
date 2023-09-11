import type Plotly from 'plotly.js-cartesian-dist'
import { type ColorTokens } from '@fluentui/react-components'

type ColorToken = ColorTokens[keyof ColorTokens]

export const tokenToColor = (token: ColorToken) =>
  getComputedStyle(document.body).getPropertyValue(
    token.substring(4, token.length - 1),
  )

export const fluentColorScale = (
  color1Token: ColorToken,
  color2Token: ColorToken,
  n: number,
): Plotly.ColorScale => {
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
  const rgb1 = hexToRgb(tokenToColor(color1Token))
  const rgb2 = hexToRgb(tokenToColor(color2Token))

  return Array.from({ length: n }, (_, i): [number, string] => {
    const t = i / (n - 1)
    const interpolatedRgb = rgb1.map((c1, j) =>
      Math.round(c1 + t * ((rgb2[j] ?? 0) - c1)),
    )
    return [t, rgbToHex(interpolatedRgb)]
  })
}
