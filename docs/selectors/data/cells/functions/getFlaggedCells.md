**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [selectors/data/cells](../README.md) / getFlaggedCells

# Function: getFlaggedCells()

> **getFlaggedCells**(`state`): readonly [`Flag`](../../../../lib/fp/Flag/interfaces/Flag.md)[]

Selector function to get the flagged cells from the data slice of the state.

## Parameters

▪ **state**: `object`

The application state [AppState](../../../../app/store/type-aliases/AppState.md)

▪ **state.data**: `Readonly`\<[`State`](../../../../features/sheet/reducers/interfaces/State.md)\>

The data slice of the state.

▪ **state.matches**: `Readonly`\<[`State`](../../../progress/paths/private/interfaces/State.md)\>

▪ **state.progress**: `Readonly`\<[`State`](../../../progress/paths/private/interfaces/State.md)\>

## Returns

readonly [`Flag`](../../../../lib/fp/Flag/interfaces/Flag.md)[]

The flagged cells.

## Example

```ts
const flaggedCells = useAppSelector(getFlaggedCells)
```

## Source

[Projects/clean-tool-app/src/selectors/data/cells.ts:25](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
