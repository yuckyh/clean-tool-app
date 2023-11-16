**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [selectors/data/visits](../README.md) / getVisits

# Function: getVisits()

> **getVisits**(`state`): readonly `string`[]

Selector function to get the visits.

## Parameters

▪ **state**: `object`

The application state [AppState](../../../../app/store/type-aliases/AppState.md)

▪ **state.data**: `Readonly`\<[`State`](../../../../features/sheet/reducers/interfaces/State.md)\>

The data slice of the state

▪ **state.matches**: `Readonly`\<[`State`](../../../progress/paths/private/interfaces/State.md)\>

▪ **state.progress**: `Readonly`\<[`State`](../../../progress/paths/private/interfaces/State.md)\>

## Returns

readonly `string`[]

The visits that has been specified by the user

## Example

```ts
const getVisit = createSelector(
   [getVisits, getColParam],
   (visits, col) => arrayLookup(visits)('')(col),
 )
```

## Source

[Projects/clean-tool-app/src/selectors/data/visits.ts:25](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
