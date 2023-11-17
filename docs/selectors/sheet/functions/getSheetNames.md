**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [selectors/sheet](../README.md) / getSheetNames

# Function: getSheetNames()

> **getSheetNames**(`state`, ...`params`): readonly `string`[]

Selector function to get the sheet names from the app state.

## Parameters

▪ **state**: `object`

The application state [AppState](../../../app/store/type-aliases/AppState.md)

▪ **state.data**: `Readonly`\<[`State`](../../../reducers/data/interfaces/State.md)\>

The data slice of the state.

▪ **state.matches**: `Readonly`\<[`State`](../../progress/progress/private/interfaces/State.md)\>

▪ **state.progress**: `Readonly`\<[`State`](../../progress/progress/private/interfaces/State.md)\>

▪ ...**params**: []

## Returns

readonly `string`[]

The sheet names.

## Example

```ts
const sheetNames = useAppSelector(getSheetNames)
```

## Source

AppData/Local/Yarn/Berry/cache/reselect-npm-4.1.8-cad5f0a3f3-10.zip/node\_modules/reselect/es/types.d.ts:8

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
