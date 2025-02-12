**CLEaN Tool - v1.0.0** ( [Readme](../../../../../../README.md) \| API )

***

[CLEaN Tool](../../../../../../modules.md) / [pages/EDA/Variable/DataGrid/selectors](../README.md) / selectMissingSeries

# Function: selectMissingSeries()

> **selectMissingSeries**(`props`): (`state`) => readonly readonly [`string`, `string`][]

Selector function to get the missing series.

## Parameters

▪ **props**: `Readonly`\<[`BaseProps`](../interfaces/BaseProps.md)\>

The [props](../interfaces/BaseProps.md) for the component.

## Returns

`function`

The missing series.

> > (`state`): readonly readonly [`string`, `string`][]
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
> readonly readonly [`string`, `string`][]
>
> ### Source
>
> [Projects/clean-tool-app/src/pages/EDA/Variable/DataGrid/selectors.ts:93](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```tsx
 const missingSeries = useAppSelector(selectMissingSeries(props))
```

## Source

[Projects/clean-tool-app/src/pages/EDA/Variable/DataGrid/selectors.ts:92](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
