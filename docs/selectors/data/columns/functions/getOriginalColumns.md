**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [selectors/data/columns](../README.md) / getOriginalColumns

# Function: getOriginalColumns()

> **getOriginalColumns**(`state`): readonly `string`[]

This selector is used to get the original columns.

## Parameters

▪ **state**: `object`

The application state [AppState](../../../../app/store/type-aliases/AppState.md)

▪ **state.data**: `Readonly`\<[`State`](../../../../reducers/data/interfaces/State.md)\>

The data slice of the application state [data](Property data:Readonly`<State>` )

▪ **state.matches**: `Readonly`\<[`State`](../../../progress/private/interfaces/State.md)\>

▪ **state.progress**: `Readonly`\<[`State`](../../../progress/private/interfaces/State.md)\>

## Returns

readonly `string`[]

The original columns.

## Example

```ts
const originalColumns = useAppSelector(getOriginalColumns)
```

## Source

[Projects/clean-tool-app/src/selectors/data/columns.ts:29](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
