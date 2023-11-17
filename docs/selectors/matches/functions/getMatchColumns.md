**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [selectors/matches](../README.md) / getMatchColumns

# Function: getMatchColumns()

> **getMatchColumns**(`state`): readonly `string`[]

Selector function to get the match columns

## Parameters

▪ **state**: `object`

The [application state](../../../app/store/type-aliases/AppState.md)

▪ **state.data**: `Readonly`\<[`State`](../../../reducers/data/interfaces/State.md)\>

▪ **state.matches**: `Readonly`\<[`State`](../../progress/private/interfaces/State.md)\>

The matches slice of the state

▪ **state.progress**: `Readonly`\<[`State`](../../progress/private/interfaces/State.md)\>

## Returns

readonly `string`[]

The match columns

## Example

```ts
const matchColumns = useAppSelector(getMatchColumns)
```

## Source

[Projects/clean-tool-app/src/selectors/matches/columns.ts:24](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
