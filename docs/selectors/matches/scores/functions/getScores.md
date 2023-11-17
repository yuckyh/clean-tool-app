**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [selectors/matches/scores](../README.md) / getScores

# Function: getScores()

> **getScores**(`state`): readonly `string`[]

Selector function to get the match scores.

## Parameters

▪ **state**: `object`

The application state [AppState](../../../../app/store/type-aliases/AppState.md)

▪ **state.data**: `Readonly`\<[`State`](../../../../reducers/data/interfaces/State.md)\>

▪ **state.matches**: `Readonly`\<[`State`](../../../progress/private/interfaces/State.md)\>

The matches slice of the state

▪ **state.progress**: `Readonly`\<[`State`](../../../progress/private/interfaces/State.md)\>

## Returns

readonly `string`[]

The match scores.

## Example

```ts
const matchScores = useAppSelector(getMatchScores)
```

## Source

[Projects/clean-tool-app/src/selectors/matches/scores.ts:21](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
