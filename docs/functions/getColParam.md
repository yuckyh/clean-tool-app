**CLEaN Tool - v1.0.0** ( [Readme](../README.md) \| API )

***

[CLEaN Tool](../exports.md) / getColParam

# Function: getColParam()

> **getColParam**(`_state`, `col`): `number`

Utility function to get the column position parameter

## Parameters

▪ **\_state**: `object`

The application state [AppState](../type-aliases/AppState.md)

▪ **\_state.columns**: `Readonly`\<`State`\>

▪ **\_state.progress**: `Readonly`\<`State`\>

▪ **\_state.sheet**: `Readonly`\<[`State`](../interfaces/State.md)\>

▪ **col**: `number`

The column position parameter

## Returns

`number`

The column position parameter

## Example

```ts
const getOriginalColumn = createSelector(
 [getOriginalColumns, getColParam],
 (originalColumns, col) => originalColumns[col],
)
```

## Source

[Projects/clean-tool-app/src/app/selectors.ts:21](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
