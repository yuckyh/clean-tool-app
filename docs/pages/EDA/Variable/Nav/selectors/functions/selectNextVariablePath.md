**CLEaN Tool - v1.0.0** ( [Readme](../../../../../../README.md) \| API )

***

[CLEaN Tool](../../../../../../modules.md) / [pages/EDA/Variable/Nav/selectors](../README.md) / selectNextVariablePath

# Function: selectNextVariablePath()

> **selectNextVariablePath**(`pos`): (`state`) => `string`

Selector function to get the next variable path.

## Parameters

▪ **pos**: `number`

The position of the variable.

## Returns

`function`

The next variable path.

> > (`state`): `string`
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
> `string`
>
> ### Source
>
> [Projects/clean-tool-app/src/pages/EDA/Variable/Nav/selectors.ts:84](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```tsx
 const nextVariablePath = useAppSelector(selectNextVariablePath(pos))
```

## Source

[Projects/clean-tool-app/src/pages/EDA/Variable/Nav/selectors.ts:84](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
