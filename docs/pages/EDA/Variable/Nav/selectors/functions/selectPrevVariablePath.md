**CLEaN Tool - v1.0.0** ( [Readme](../../../../../../README.md) \| API )

***

[CLEaN Tool](../../../../../../modules.md) / [pages/EDA/Variable/Nav/selectors](../README.md) / selectPrevVariablePath

# Function: selectPrevVariablePath()

> **selectPrevVariablePath**(`pos`): (`state`) => `string`

Selector function to get the previous variable path.

## Parameters

▪ **pos**: `number`

The position of the variable.

## Returns

`function`

The previous variable path.

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
> [Projects/clean-tool-app/src/pages/EDA/Variable/Nav/selectors.ts:72](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```tsx
 const prevVariablePath = useAppSelector(selectPrevVariablePath(pos))
```

## Source

[Projects/clean-tool-app/src/pages/EDA/Variable/Nav/selectors.ts:72](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
