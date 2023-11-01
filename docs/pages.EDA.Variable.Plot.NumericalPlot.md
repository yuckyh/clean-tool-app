# Module: pages/EDA/Variable/Plot/NumericalPlot

## Table of contents

### Functions

- [default](../wiki/pages.EDA.Variable.Plot.NumericalPlot#default)

## Component

### default

▸ **default**(`«destructured»`): `Element`

The function to generate render the numerical plot. The plot is currently configured to render only a box plot.

The box plot is rendered with the outliers as red x's and the non-outliers as blue x's.

The y-axis is jittered to prevent the x's from overlapping.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Props` |

#### Returns

`Element`

**`Argument`**

props - The component prop Props

#### Defined in

[Projects/clean-tool-app/src/pages/EDA/Variable/Plot/NumericalPlot.tsx:47](https://github.com/yuckyh/clean-tool-app/)
