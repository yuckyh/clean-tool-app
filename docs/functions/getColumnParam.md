**CLEaN Tool - v1.0.0** ( [Readme](../README.md) \| API )

***

[CLEaN Tool](../exports.md) / getColumnParam

# Function: getColumnParam()

> **getColumnParam**(`_state`, `column`): `string`

Utility function to get the column parameter

## Parameters

▪ **\_state**: `object`

The application state [AppState](../type-aliases/AppState.md)

▪ **\_state.columns**: `Readonly`\<[`State`](../private/interfaces/State.md)\>

▪ **\_state.progress**: `Readonly`\<[`State`](../private/interfaces/State.md)\>

▪ **\_state.sheet**: `Readonly`\<[`State`](../interfaces/State.md)\>

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

[Projects/clean-tool-app/src/app/selectors.ts:54](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
