**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [selectors/matches/results](../README.md) / getMatchResults

# Function: getMatchResults()

> **getMatchResults**(`state`): readonly readonly string[][]

Selector function to get the match results from the matches slice of the state.

## Parameters

▪ **state**: `object`

The application state [AppState](../../../../app/store/type-aliases/AppState.md)

▪ **state.data**: `Readonly`\<[`State`](../../../../features/sheet/reducers/interfaces/State.md)\>

▪ **state.matches**: `Readonly`\<[`State`](../../../progress/paths/private/interfaces/State.md)\>

The matches slice of the state.

▪ **state.progress**: `Readonly`\<[`State`](../../../progress/paths/private/interfaces/State.md)\>

## Returns

readonly readonly string[][]

The match results.

## Example

```ts
const matchResults = useAppSelector(getMatchResults)
```

## Source

[Projects/clean-tool-app/src/selectors/matches/results.ts:20](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
