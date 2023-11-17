**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [components/data/selectors](../README.md) / selectDataType

# Function: selectDataType()

> **selectDataType**(`props`): (`state`) => [`DataType`](../../../../features/columns/reducers/type-aliases/DataType.md)

Selector function to get the data type of the column.

## Parameters

▪ **props**: `Readonly`\<[`ColProps`](../private/interfaces/ColProps.md)\>

The props for the component.

## Returns

`function`

The data type of the column.

> > (`state`): [`DataType`](../../../../features/columns/reducers/type-aliases/DataType.md)
>
> ### Parameters
>
> ▪ **state**: `object`
>
> ▪ **state.data**: `Readonly`\<[`State`](../../../../reducers/data/interfaces/State.md)\>
>
> ▪ **state.matches**: `Readonly`\<[`State`](../../../../selectors/progress/private/interfaces/State.md)\>
>
> ▪ **state.progress**: `Readonly`\<[`State`](../../../../selectors/progress/private/interfaces/State.md)\>
>
> ### Returns
>
> [`DataType`](../../../../features/columns/reducers/type-aliases/DataType.md)
>
> ### Source
>
> [Projects/clean-tool-app/src/components/data/selectors.ts:101](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```tsx
 const dataType = useAppSelector(selectDataType(props))
```

## Source

[Projects/clean-tool-app/src/components/data/selectors.ts:100](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
