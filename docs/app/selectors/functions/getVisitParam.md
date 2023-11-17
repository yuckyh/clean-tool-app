**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [app/selectors](../README.md) / getVisitParam

# Function: getVisitParam()

> **getVisitParam**(`_state`, `_column`, `visit`): `string`

Utility function to get the visit parameter

## Parameters

▪ **\_state**: `object`

The application state [AppState](../../store/type-aliases/AppState.md)

▪ **\_state.data**: `Readonly`\<[`State`](../../../reducers/data/interfaces/State.md)\>

▪ **\_state.matches**: `Readonly`\<[`State`](../../../selectors/progress/private/interfaces/State.md)\>

▪ **\_state.progress**: `Readonly`\<[`State`](../../../selectors/progress/private/interfaces/State.md)\>

▪ **\_column**: `string`

The column parameter

▪ **visit**: `string`

The visit parameter

## Returns

`string`

The visit parameter

## Example

```ts
const getSearchedPos = createSelector(
   [getIndices, getVisits, getColumnParam, getVisitParam],
   searchPos,
 )
```

## Source

[Projects/clean-tool-app/src/app/selectors.ts:66](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
