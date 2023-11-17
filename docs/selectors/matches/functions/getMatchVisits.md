**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [selectors/matches](../README.md) / getMatchVisits

# Function: getMatchVisits()

> **getMatchVisits**(`state`): readonly `number`[]

Selector function to get the match visits.

## Parameters

▪ **state**: `object`

The application state [AppState](../../../app/store/type-aliases/AppState.md)

▪ **state.data**: `Readonly`\<[`State`](../../../reducers/data/interfaces/State.md)\>

▪ **state.matches**: `Readonly`\<[`State`](../../progress/private/interfaces/State.md)\>

The matches slice of the state

▪ **state.progress**: `Readonly`\<[`State`](../../progress/private/interfaces/State.md)\>

## Returns

readonly `number`[]

The match visits.

## Example

```ts
const matchVisits = useAppSelector(getMatchVisits)
```

## Source

[Projects/clean-tool-app/src/selectors/matches/visits.ts:25](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
