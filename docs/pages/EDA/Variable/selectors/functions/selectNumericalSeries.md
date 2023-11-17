**CLEaN Tool - v1.0.0** ( [Readme](../../../../../README.md) \| API )

***

[CLEaN Tool](../../../../../modules.md) / [pages/EDA/Variable/selectors](../README.md) / selectNumericalSeries

# Function: selectNumericalSeries()

> **selectNumericalSeries**(`props`): (`state`) => readonly readonly [`string`, `number`][]

Selector function to get the numerical series.

## Parameters

▪ **props**: `Readonly`\<[`BaseProps`](../../DataGrid/selectors/interfaces/BaseProps.md)\>

The [props](../../DataGrid/selectors/interfaces/BaseProps.md) for the component.

## Returns

`function`

The numerical series.

> > (`state`): readonly readonly [`string`, `number`][]
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
> readonly readonly [`string`, `number`][]
>
> ### Source
>
> [Projects/clean-tool-app/src/pages/EDA/Variable/selectors.ts:85](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```tsx
 const numericalSeries = useAppSelector(selectNumericalSeries(props))
```

## Source

[Projects/clean-tool-app/src/pages/EDA/Variable/selectors.ts:84](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
