**CLEaN Tool - v1.0.0** ( [Readme](../../README.md) \| API )

***

[CLEaN Tool](../../exports.md) / [private](../README.md) / Props

# Interface: Props

Props for the numerical plot component [NumericalPlot](../../functions/NumericalPlot.md).

## Contents

- [Example](Props.md#example)
- [Properties](Props.md#properties)
  - [column](Props.md#column)
  - [unit](Props.md#unit)
  - [variable](Props.md#variable)
  - [visit](Props.md#visit)

## Example

```tsx
<NumericalPlot
  column="al_r"
  unit="mm"
  variable="al_r_1"
  visit="1" />
```

## Properties

### column

> **column**: `string`

The column used to get the row for plotting.

#### Source

[Projects/clean-tool-app/src/pages/EDA/Variable/Plot/NumericalPlot.tsx:35](https://github.com/yuckyh/clean-tool-app/)

***

### unit

> **unit**: `string`

The measurement unit.

#### Source

[Projects/clean-tool-app/src/pages/EDA/Variable/Plot/NumericalPlot.tsx:39](https://github.com/yuckyh/clean-tool-app/)

***

### variable

> **variable**: `string`

The variable name of the formatted column and visit for the plot.

#### Source

[Projects/clean-tool-app/src/pages/EDA/Variable/Plot/NumericalPlot.tsx:43](https://github.com/yuckyh/clean-tool-app/)

***

### visit

> **visit**: `string`

The visit for the plot.

#### Source

[Projects/clean-tool-app/src/pages/EDA/Variable/Plot/NumericalPlot.tsx:47](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
