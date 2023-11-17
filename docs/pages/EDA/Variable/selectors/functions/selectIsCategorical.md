**CLEaN Tool - v1.0.0** ( [Readme](../../../../../README.md) \| API )

***

[CLEaN Tool](../../../../../modules.md) / [pages/EDA/Variable/selectors](../README.md) / selectIsCategorical

# Function: selectIsCategorical()

> **selectIsCategorical**(`column`, `visit`): (`state`) => `boolean`

Selector function to get whether the variable is categorical.

## Parameters

▪ **column**: `string`

The column name.

▪ **visit**: `string`

The visit value.

## Returns

`function`

Whether the variable is categorical.

> > (`state`): `boolean`
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
> `boolean`
>
> ### Source
>
> [Projects/clean-tool-app/src/pages/EDA/Variable/selectors.ts:39](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```tsx
 const isCategorical = useAppSelector(selectIsCategorical(column, visit))
```

## Source

[Projects/clean-tool-app/src/pages/EDA/Variable/selectors.ts:39](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
