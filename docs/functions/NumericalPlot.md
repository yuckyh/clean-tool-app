**CLEaN Tool - v1.0.0** ( [Readme](../README.md) \| API )

***

[CLEaN Tool](../exports.md) / NumericalPlot

# Function: NumericalPlot()

> **NumericalPlot**(`props`): `Readonly`\<`JSX.Element`\>

The function to generate render the numerical plot. The plot is currently configured to render only a box plot.

The box plot is rendered with the outliers as red x's and the non-outliers as blue x's.

The y-axis is jittered to prevent the x's from overlapping.

## Parameters

▪ **props**: `Readonly`\<[`Props`](../interfaces/Props.md)\>

The component's props

## Returns

`Readonly`\<`JSX.Element`\>

{JSX.Element} The numerical plot component

## Source

[Projects/clean-tool-app/src/pages/EDA/Variable/Plot/NumericalPlot.tsx:51](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
