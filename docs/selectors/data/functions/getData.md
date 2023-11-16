**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [selectors/data](../README.md) / getData

# Function: getData()

> **getData**(`state`): readonly [`CellItem`](../../../lib/fp/CellItem/interfaces/CellItem.md)\<[`Value`](../../../lib/fp/CellItem/type-aliases/Value.md)\>[]

Selector function to get the data from the sheet slice of the state.

## Parameters

▪ **state**: `object`

The application state [AppState](../../../app/store/type-aliases/AppState.md).

▪ **state.data**: `Readonly`\<[`State`](../../../features/sheet/reducers/interfaces/State.md)\>

The data slice of the state.

▪ **state.matches**: `Readonly`\<[`State`](../../progress/paths/private/interfaces/State.md)\>

▪ **state.progress**: `Readonly`\<[`State`](../../progress/paths/private/interfaces/State.md)\>

## Returns

readonly [`CellItem`](../../../lib/fp/CellItem/interfaces/CellItem.md)\<[`Value`](../../../lib/fp/CellItem/type-aliases/Value.md)\>[]

The data from the sheet slice of the state.

## Example

```ts
const getColumnsByData = createSelector(
   [getData],
   f.flow(
     RA.map(RR.keys),
     head,
     f.apply([] as readonly (keyof CellItem.CellItem)[]),
   ),
 )
```

## Source

[Projects/clean-tool-app/src/selectors/data/index.ts:18](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
