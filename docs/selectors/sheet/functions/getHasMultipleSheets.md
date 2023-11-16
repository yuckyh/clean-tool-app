**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [selectors/sheet](../README.md) / getHasMultipleSheets

# Function: getHasMultipleSheets()

> **getHasMultipleSheets**(`state`): `boolean`

Selector function to get whether the workbook has multiple sheets.

## Parameters

▪ **state**: `object`

The application state [AppState](../../../app/store/type-aliases/AppState.md)

▪ **state.data**: `Readonly`\<[`State`](../../../features/sheet/reducers/interfaces/State.md)\>

The data slice of the state.

▪ **state.matches**: `Readonly`\<[`State`](../../progress/paths/private/interfaces/State.md)\>

▪ **state.progress**: `Readonly`\<[`State`](../../progress/paths/private/interfaces/State.md)\>

## Returns

`boolean`

Whether the workbook has multiple sheets.

## Example

```ts
const hasMultipleSheets = useAppSelector(getHasMultipleSheets)
```

## Source

[Projects/clean-tool-app/src/selectors/data/sheet.ts:78](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
