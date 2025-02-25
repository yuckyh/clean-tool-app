**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [selectors/matches/dataTypes](../README.md) / getDataTypes

# Function: getDataTypes()

> **getDataTypes**(`state`): readonly [`DataType`](../../../../reducers/matches/type-aliases/DataType.md)[]

Selector function to get the data types from the matches slice of the state.

## Parameters

▪ **state**: `object`

The application state [AppState](../../../../app/store/type-aliases/AppState.md)

▪ **state.data**: `Readonly`\<[`State`](../../../../reducers/data/interfaces/State.md)\>

▪ **state.matches**: `Readonly`\<[`State`](../../../progress/private/interfaces/State.md)\>

The matches slice of the state.

▪ **state.progress**: `Readonly`\<[`State`](../../../progress/private/interfaces/State.md)\>

## Returns

readonly [`DataType`](../../../../reducers/matches/type-aliases/DataType.md)[]

The data types from the matches slice of the state.

## Example

```ts
const dataTypes = useAppSelector(getDataTypes)
```

## Source

[Projects/clean-tool-app/src/selectors/matches/dataTypes.ts:22](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
