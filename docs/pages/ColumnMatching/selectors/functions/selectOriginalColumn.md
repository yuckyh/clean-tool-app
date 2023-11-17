**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [pages/ColumnMatching/selectors](../README.md) / selectOriginalColumn

# Function: selectOriginalColumn()

> **selectOriginalColumn**(`props`): (`state`) => `string`

Selector function to get the original column.

## Parameters

▪ **props**: `Readonly`\<[`BaseProps`](../private/interfaces/BaseProps.md)\>

The [props](../private/interfaces/BaseProps.md) for the component.

## Returns

`function`

The original column.

> > (`state`): `string`
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
> `string`
>
> ### Source
>
> [Projects/clean-tool-app/src/pages/ColumnMatching/selectors.ts:36](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```tsx
 const originalColumn = useAppSelector(selectOriginalColumn(props))
```

## Source

[Projects/clean-tool-app/src/pages/ColumnMatching/selectors.ts:35](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
