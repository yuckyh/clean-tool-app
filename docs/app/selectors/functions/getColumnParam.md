**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [app/selectors](../README.md) / getColumnParam

# Function: getColumnParam()

> **getColumnParam**(`_state`, `column`): `string`

Utility function to get the column parameter

## Parameters

▪ **\_state**: `object`

The application state [AppState](../../store/type-aliases/AppState.md)

▪ **\_state.columns**: `Readonly`\<[`State`](../../../selectors/columns/selectors/private/interfaces/State.md)\>

▪ **\_state.progress**: `Readonly`\<[`State`](../../../selectors/columns/selectors/private/interfaces/State.md)\>

▪ **\_state.sheet**: `Readonly`\<[`State`](../../../features/sheet/reducers/interfaces/State.md)\>

▪ **column**: `string`

The column parameter

## Returns

`string`

The column parameter

## Example

```ts
const originalColumn = createSelector(
 [getOriginalColumn, getColumnParam],
 (originalColumn, column) => data.map((row) => row[column]),
)
```

## Source

[Projects/clean-tool-app/src/app/selectors.ts:53](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
