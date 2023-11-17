**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [selectors/matches/dataTypes](../README.md) / getSearchedDataType

# Function: getSearchedDataType()

> **getSearchedDataType**(`state`, ...`params`): [`DataType`](../../../../reducers/matches/type-aliases/DataType.md)

Selector function to get the searched data type from the data types array.

## Parameters

▪ **state**: `object`

The application state [AppState](../../../../app/store/type-aliases/AppState.md)

▪ **state.data**: `Readonly`\<[`State`](../../../../reducers/data/interfaces/State.md)\>

▪ **state.matches**: `Readonly`\<[`State`](../../../progress/private/interfaces/State.md)\>

▪ **state.progress**: `Readonly`\<[`State`](../../../progress/private/interfaces/State.md)\>

▪ ...**params**: [`string`, `string`]

## Returns

[`DataType`](../../../../reducers/matches/type-aliases/DataType.md)

The searched data type from the data types array

## Example

```ts
const searchedDataType = useAppSelector(getSearchedDataType)
```

## Source

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node\_modules/reselect/es/types.d.ts:8

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
