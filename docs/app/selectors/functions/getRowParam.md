**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [app/selectors](../README.md) / getRowParam

# Function: getRowParam()

> **getRowParam**(`_state`, `_col`, `row`): `number`

Utility function to get the column position parameter

This function is to be used with the column position parameter to select a cell from the data array

## Parameters

▪ **\_state**: `object`

The application state [AppState](../../store/type-aliases/AppState.md)

▪ **\_state.data**: `Readonly`\<[`State`](../../../reducers/data/interfaces/State.md)\>

▪ **\_state.matches**: `Readonly`\<[`State`](../../../selectors/progress/private/interfaces/State.md)\>

▪ **\_state.progress**: `Readonly`\<[`State`](../../../selectors/progress/private/interfaces/State.md)\>

▪ **\_col**: `number`

The column position parameter

▪ **row**: `number`

The row position parameter

## Returns

`number`

The row position parameter

## Example

```ts
const getCell = createSelector(
   [getData, getOriginalColumn, getRowParam],
   (data, originalColumn, row) =>
     ...
 )
```

## Source

[Projects/clean-tool-app/src/app/selectors.ts:39](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
