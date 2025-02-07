**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [app/selectors](../README.md) / getColParam

# Function: getColParam()

> **getColParam**(`_state`, `col`): `number`

Utility function to get the column position parameter

## Parameters

▪ **\_state**: `object`

The application state [AppState](../../store/type-aliases/AppState.md)

▪ **\_state.data**: `Readonly`\<[`State`](../../../reducers/data/interfaces/State.md)\>

▪ **\_state.matches**: `Readonly`\<[`State`](../../../selectors/progress/private/interfaces/State.md)\>

▪ **\_state.progress**: `Readonly`\<[`State`](../../../selectors/progress/private/interfaces/State.md)\>

▪ **col**: `number`

The column position parameter

## Returns

`number`

The column position parameter

## Example

```ts
const getOriginalColumn = createSelector(
   [getOriginalColumns, getColParam],
     ...
 )
```

## Source

[Projects/clean-tool-app/src/app/selectors.ts:31](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
