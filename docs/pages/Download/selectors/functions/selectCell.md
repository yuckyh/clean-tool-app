**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [pages/Download/selectors](../README.md) / selectCell

# Function: selectCell()

> **selectCell**(`props`): (`state`) => [`Value`](../../../../lib/fp/CellItem/type-aliases/Value.md)

Selector function to get the cell.

## Parameters

▪ **props**: `Readonly`\<[`BaseProps`](../private/interfaces/BaseProps.md)\>

The [props](../private/interfaces/BaseProps.md) for the component.

## Returns

`function`

The cell.

> > (`state`): [`Value`](../../../../lib/fp/CellItem/type-aliases/Value.md)
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
> [`Value`](../../../../lib/fp/CellItem/type-aliases/Value.md)
>
> ### Source
>
> [Projects/clean-tool-app/src/pages/Download/selectors.ts:40](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```tsx
 const cell = useAppSelector(selectCell(props))
```

## Source

[Projects/clean-tool-app/src/pages/Download/selectors.ts:39](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
