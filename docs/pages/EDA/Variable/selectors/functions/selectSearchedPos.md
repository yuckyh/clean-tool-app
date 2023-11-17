**CLEaN Tool - v1.0.0** ( [Readme](../../../../../README.md) \| API )

***

[CLEaN Tool](../../../../../modules.md) / [pages/EDA/Variable/selectors](../README.md) / selectSearchedPos

# Function: selectSearchedPos()

> **selectSearchedPos**(`column`, `visit`): (`state`) => `number`

Selector function to get the column position.

## Parameters

▪ **column**: `string`

The column name.

▪ **visit**: `string`

The visit value.

## Returns

`function`

The searched column position.

> > (`state`): `number`
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
> `number`
>
> ### Source
>
> [Projects/clean-tool-app/src/pages/EDA/Variable/selectors.ts:25](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```tsx
 const pos = useAppSelector(selectSearchedPos(column, visit))
```

## Source

[Projects/clean-tool-app/src/pages/EDA/Variable/selectors.ts:25](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
