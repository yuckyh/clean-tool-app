**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [selectors/data](../README.md) / getDataLength

# Function: getDataLength()

> **getDataLength**(`state`): `number`

Selector function to get the data length.

## Parameters

▪ **state**: `object`

The application state [AppState](../../../app/store/type-aliases/AppState.md).

▪ **state.data**: `Readonly`\<[`State`](../../../reducers/data/interfaces/State.md)\>

The data slice of the state.

▪ **state.matches**: `Readonly`\<[`State`](../../progress/private/interfaces/State.md)\>

▪ **state.progress**: `Readonly`\<[`State`](../../progress/private/interfaces/State.md)\>

## Returns

`number`

The data length.

## Example

```ts
const dataLength = useAppSelector(getDataLength)
```

## Source

[Projects/clean-tool-app/src/selectors/data/index.ts:32](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
