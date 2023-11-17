**CLEaN Tool - v1.0.0** ( [Readme](../../../../../../README.md) \| API )

***

[CLEaN Tool](../../../../../../modules.md) / [pages/EDA/Variable/DataGrid/selectors](../README.md) / selectFlaggedRows

# Function: selectFlaggedRows()

> **selectFlaggedRows**(`title`, `reason`): (`state`) => `ReadonlySet`\<`string`\>

Selector function to get the flagged rows.

## Parameters

▪ **title**: `string`

The variable title.

▪ **reason**: [`FlagReason`](../../../../../../lib/fp/Flag/type-aliases/FlagReason.md)

The flag reason.

## Returns

`function`

The flagged rows.

> > (`state`): `ReadonlySet`\<`string`\>
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
> `ReadonlySet`\<`string`\>
>
> ### Source
>
> [Projects/clean-tool-app/src/pages/EDA/Variable/DataGrid/selectors.ts:61](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```tsx
 const flaggedRows = useAppSelector(selectFlaggedRows(title, reason))
```

## Source

[Projects/clean-tool-app/src/pages/EDA/Variable/DataGrid/selectors.ts:61](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
