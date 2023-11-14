**CLEaN Tool - v1.0.0** ( [Readme](../../../../../../README.md) \| API )

***

[CLEaN Tool](../../../../../../modules.md) / [pages/EDA/Variable/Plot/NumericalPlot](../README.md) / NumericalPlot

# Function: NumericalPlot()

> **NumericalPlot**(`props`): `Readonly`\<`JSX.Element`\>

The function to generate render the numerical plot. The plot is currently configured to render only a box plot.

The box plot is rendered with the outliers as red x's and the non-outliers as blue x's.

The y-axis is jittered to prevent the x's from overlapping.

## Parameters

▪ **props**: `Readonly`\<[`Props`](../private/interfaces/Props.md)\>

The component's props

## Returns

`Readonly`\<`JSX.Element`\>

The numerical plot component

## Example

A variable with column name `al_r` and visit `1` with unit `mm` will have variable `al_r_1` resulting to the following usage:
```tsx
<NumericalPlot
  column="al_r"
  unit="mm"
  variable="al_r_1"
  visit="1" />
```

## Source

[Projects/clean-tool-app/src/pages/EDA/Variable/Plot/NumericalPlot.tsx:119](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
