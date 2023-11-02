# Module: pages/EDA/Variable/Plot/NumericalPlot

## Table of contents

### Interfaces

- [Props](../wiki/pages.EDA.Variable.Plot.NumericalPlot.Props)

### Functions

- [default](../wiki/pages.EDA.Variable.Plot.NumericalPlot#default)

## Functions

### default

▸ **default**(`«destructured»`): `Element`

The function to generate render the numerical plot. The plot is currently configured to render only a box plot.

The box plot is rendered with the outliers as red x's and the non-outliers as blue x's.

The y-axis is jittered to prevent the x's from overlapping.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`Props`](../wiki/pages.EDA.Variable.Plot.NumericalPlot.Props) |

#### Returns

`Element`

**`Function`**

NumericalPlot

**`Argument`**

props - The component's props

#### Defined in

[Projects/clean-tool-app/src/pages/EDA/Variable/Plot/NumericalPlot.tsx:46](https://github.com/yuckyh/clean-tool-app/)
