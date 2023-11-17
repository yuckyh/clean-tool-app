**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [selectors/sheet](../README.md) / getFileName

# Function: getFileName()

> **getFileName**(`state`): `string`

Selector function to get the file name from the app state.

## Parameters

▪ **state**: `object`

The application state [AppState](../../../app/store/type-aliases/AppState.md)

▪ **state.data**: `Readonly`\<[`State`](../../../reducers/data/interfaces/State.md)\>

The data slice of the state.

▪ **state.matches**: `Readonly`\<[`State`](../../progress/progress/private/interfaces/State.md)\>

▪ **state.progress**: `Readonly`\<[`State`](../../progress/progress/private/interfaces/State.md)\>

## Returns

`string`

The file name.

## Example

```ts
const fileName = useAppSelector(getFileName)
```

## Source

[Projects/clean-tool-app/src/selectors/data/sheet.ts:48](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
