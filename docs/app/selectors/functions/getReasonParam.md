**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [app/selectors](../README.md) / getReasonParam

# Function: getReasonParam()

> **getReasonParam**(`_state`, `_title`, `reason`): [`FlagReason`](../../../lib/fp/Flag/type-aliases/FlagReason.md)

Utility function to get the reason parameter

## Parameters

▪ **\_state**: `object`

The application state [AppState](../../store/type-aliases/AppState.md)

▪ **\_state.data**: `Readonly`\<[`State`](../../../reducers/data/interfaces/State.md)\>

▪ **\_state.matches**: `Readonly`\<[`State`](../../../selectors/progress/progress/private/interfaces/State.md)\>

▪ **\_state.progress**: `Readonly`\<[`State`](../../../selectors/progress/progress/private/interfaces/State.md)\>

▪ **\_title**: `string`

The title parameter

▪ **reason**: [`FlagReason`](../../../lib/fp/Flag/type-aliases/FlagReason.md)

The reason parameter

## Returns

[`FlagReason`](../../../lib/fp/Flag/type-aliases/FlagReason.md)

The reason parameters

## Example

```ts
const getFlaggedRows = createSelector(
   [getFlaggedCells, getTitleParam, getReasonParam],
   (flaggedCells, title, reason) =>
     ...
 )
```

## Source

[Projects/clean-tool-app/src/app/selectors.ts:152](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
