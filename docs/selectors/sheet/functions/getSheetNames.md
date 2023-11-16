**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [selectors/sheet](../README.md) / getSheetNames

# Function: getSheetNames()

> **getSheetNames**(`state`): readonly `string`[]

Selector function to get the sheet names from the app state.

## Parameters

▪ **state**: `object`

The application state [AppState](../../../app/store/type-aliases/AppState.md)

▪ **state.data**: `Readonly`\<[`State`](../../../features/sheet/reducers/interfaces/State.md)\>

The data slice of the state.

▪ **state.matches**: `Readonly`\<[`State`](../../progress/paths/private/interfaces/State.md)\>

▪ **state.progress**: `Readonly`\<[`State`](../../progress/paths/private/interfaces/State.md)\>

## Returns

readonly `string`[]

The sheet names.

## Example

```ts
const sheetNames = useAppSelector(getSheetNames)
```

## Source

[Projects/clean-tool-app/src/selectors/data/sheet.ts:68](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
