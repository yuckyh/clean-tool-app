**CLEaN Tool - v1.0.0** ( [Readme](../../../../../README.md) \| API )

***

[CLEaN Tool](../../../../../modules.md) / [pages/EDA/Variable/selectors](../README.md) / selectCategoricalSeries

# Function: selectCategoricalSeries()

> **selectCategoricalSeries**(`props`): (`state`) => readonly readonly [`string`, `string`][]

Selector function to get the categorical series.

## Parameters

▪ **props**: `Readonly`\<[`BaseProps`](../../DataGrid/selectors/interfaces/BaseProps.md)\>

The [props](../../DataGrid/selectors/interfaces/BaseProps.md) for the component.

## Returns

`function`

The categorical series.

> > (`state`): readonly readonly [`string`, `string`][]
>
> ### Parameters
>
> ▪ **state**: `object`
>
> ▪ **state.data**: `Readonly`\<[`State`](../../../../../reducers/data/interfaces/State.md)\>
>
> ▪ **state.matches**: `Readonly`\<[`State`](../../../../../selectors/progress/private/interfaces/State.md)\>
>
> ▪ **state.progress**: `Readonly`\<[`State`](../../../../../selectors/progress/private/interfaces/State.md)\>
>
> ### Returns
>
> readonly readonly [`string`, `string`][]
>
> ### Source
>
> [Projects/clean-tool-app/src/pages/EDA/Variable/selectors.ts:68](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```tsx
 const categoricalSeries = useAppSelector(selectCategoricalSeries(props))
```

## Source

[Projects/clean-tool-app/src/pages/EDA/Variable/selectors.ts:67](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
