**CLEaN Tool - v1.0.0** ( [Readme](../../../../../../README.md) \| API )

***

[CLEaN Tool](../../../../../../modules.md) / [pages/EDA/Variable/DataGrid/selectors](../README.md) / selectMedian

# Function: selectMedian()

> **selectMedian**(`props`): (`state`) => `number`

Selector function to get the median.

## Parameters

▪ **props**: `Readonly`\<[`BaseProps`](../interfaces/BaseProps.md)\>

The [props](../interfaces/BaseProps.md) for the component.

## Returns

`function`

The median.

> > (`state`): `number`
>
> ### Parameters
>
> ▪ **state**: `object`
>
> ▪ **state.data**: `Readonly`\<[`State`](../../../../../../reducers/data/interfaces/State.md)\>
>
> ▪ **state.matches**: `Readonly`\<[`State`](../../../../../../selectors/progress/private/interfaces/State.md)\>
>
> ▪ **state.progress**: `Readonly`\<[`State`](../../../../../../selectors/progress/private/interfaces/State.md)\>
>
> ### Returns
>
> `number`
>
> ### Source
>
> [Projects/clean-tool-app/src/pages/EDA/Variable/DataGrid/selectors.ts:189](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```tsx
 const median = useAppSelector(selectMedian(props))
```

## Source

[Projects/clean-tool-app/src/pages/EDA/Variable/DataGrid/selectors.ts:188](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
