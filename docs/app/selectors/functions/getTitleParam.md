**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [app/selectors](../README.md) / getTitleParam

# Function: getTitleParam()

> **getTitleParam**(`_state`, `title`): `string`

Utility function to get the title parameter

## Parameters

▪ **\_state**: `object`

The application state [AppState](../../store/type-aliases/AppState.md)

▪ **\_state.data**: `Readonly`\<[`State`](../../../reducers/data/interfaces/State.md)\>

▪ **\_state.matches**: `Readonly`\<[`State`](../../../selectors/progress/private/interfaces/State.md)\>

▪ **\_state.progress**: `Readonly`\<[`State`](../../../selectors/progress/private/interfaces/State.md)\>

▪ **title**: `string`

The title parameter

## Returns

`string`

The title parameter

## Example

```ts
const getFlaggedRows = createSelector(
   [getFlaggedCells, getTitleParam, getReasonParam],
     ...
 )
```

## Source

[Projects/clean-tool-app/src/app/selectors.ts:155](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
