**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [lib/plotly](../README.md) / useFluentColorScale

# Function: useFluentColorScale()

> **useFluentColorScale**(`color1Token`, `color2Token`, `n`): `ColorScale`

The function to create a color scale from two color tokens.

## Parameters

▪ **color1Token**: `string`

The first color token.

▪ **color2Token**: `string`

The second color token.

▪ **n**: `number`

The number of steps in the color scale.

## Returns

`ColorScale`

A color scale.

## Example

```ts
useFluentColorScale('neutralPrimary', 'neutralPrimary', 3) // => [[0, '#000000'], [0.5, '#7f7f7f'], [1, '#ffffff']]
```

## Source

[Projects/clean-tool-app/src/lib/plotly.ts:96](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
