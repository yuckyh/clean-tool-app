**CLEaN Tool - v1.0.0** ( [Readme](../../../../../../README.md) \| API )

***

[CLEaN Tool](../../../../../../modules.md) / [pages/EDA/Variable/DataGrid/selectors](../README.md) / selectDataType

# Function: selectDataType()

> **selectDataType**(`props`): (`state`) => [`DataType`](../../../../../../reducers/matches/type-aliases/DataType.md)

Selector function to get the data type.

## Parameters

▪ **props**: `Readonly`\<[`BaseProps`](../interfaces/BaseProps.md)\>

The [props](../interfaces/BaseProps.md) for the component.

## Returns

`function`

The data type.

> > (`state`): [`DataType`](../../../../../../reducers/matches/type-aliases/DataType.md)
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
> [`DataType`](../../../../../../reducers/matches/type-aliases/DataType.md)
>
> ### Source
>
> [Projects/clean-tool-app/src/pages/EDA/Variable/DataGrid/selectors.ts:157](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```tsx
 const dataType = useAppSelector(selectDataType(props))
```

## Source

[Projects/clean-tool-app/src/pages/EDA/Variable/DataGrid/selectors.ts:156](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
