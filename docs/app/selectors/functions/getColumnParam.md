**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [app/selectors](../README.md) / getColumnParam

# Function: getColumnParam()

> **getColumnParam**(`_state`, `column`): `string`

Utility function to get the column parameter

## Parameters

▪ **\_state**: `object`

The application state [AppState](../../store/type-aliases/AppState.md)

▪ **\_state.data**: `Readonly`\<[`State`](../../../reducers/data/interfaces/State.md)\>

▪ **\_state.matches**: `Readonly`\<[`State`](../../../selectors/progress/private/interfaces/State.md)\>

▪ **\_state.progress**: `Readonly`\<[`State`](../../../selectors/progress/private/interfaces/State.md)\>

▪ **column**: `string`

The column parameter

## Returns

`string`

The column parameter

## Example

```ts
const getSearchedPos = createSelector(
   [getIndices, getVisits, getColumnParam, getVisitParam],
   searchPos,
 )
```

## Source

[Projects/clean-tool-app/src/app/selectors.ts:52](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
